// Checks the built site in dist/. Run with `npm run verify`.
// Uses only Node built-ins so it keeps working without extra packages.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { loadPrivateRules } from './private-rules.mjs';

const DIST = new URL('../dist/', import.meta.url).pathname;
// False since 24 Nov 2026, when the owner said "publish". While it was true, every page had to carry a
// search-engine block; now no page may carry one.
const SITE_IS_PRIVATE = false;

// Things that must never appear on the site. These general rules are safe to publish.
const FORBIDDEN = [
  { name: 'personal email', pattern: /gmail\.com/i },
  { name: 'visa or immigration status', pattern: /\b(visa|H-1B|F-1|OPT|green card)\b/i },
  { name: 'manuscript in preparation', pattern: /in preparation/i },
  { name: 'placeholder text', pattern: /lorem ipsum|TODO|TBD/i },
  { name: 'university login address', pattern: /\b[a-z]{2,3}\d{5}@uga\.edu\b/i },
  { name: 'manuscript tracking number', pattern: /\b[A-Z]{4,8}-D-\d{2}-\d{4,6}\b/ },
  { name: 'citation metrics', pattern: /\bh-index\b|\bi10\b|\b\d+\s+citations\b/i },
  // A manuscript under review must never read as accepted.
  { name: 'publication status that is not yet true', pattern: /\b(forthcoming|in press|accepted for publication)\b/i },
];

const problems = [];

// The owner's own private details are checked too. Their patterns live in private/forbidden.json,
// which is never committed, because this repository is public and the patterns would reveal them.
const privateRules = loadPrivateRules();
if (privateRules) FORBIDDEN.push(...privateRules);
else problems.push('private/forbidden.json is missing, so the check for the owner’s private details did not run. See scripts/private-rules.mjs.');
const pages = [];
const documents = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.html')) pages.push(full);
    else if (/\.(pdf|docx?|pptx?|xlsx?)$/i.test(name)) documents.push(full);
  }
}

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}
walk(DIST);

const route = (file) => '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
const html = new Map(pages.map((file) => [route(file), readFileSync(file, 'utf8')]));
const idsByRoute = new Map(
  [...html].map(([r, text]) => [r, new Set([...text.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]),
);

const isBuiltFile = (path) => {
  const full = join(DIST, path);
  return existsSync(full) && !statSync(full).isDirectory();
};
// "/research" and "/research/" are the same page; a path to a real file is left alone.
const normalize = (path) => (path.endsWith('/') || isBuiltFile(path) ? path : path + '/');

for (const [r, text] of html) {
  // Everything a reader or a search engine can see: page text, image descriptions, and the structured data.
  const visible = text.replace(/<style[\s\S]*?<\/style>/g, '');

  for (const { name, pattern } of FORBIDDEN) {
    const match = visible.match(pattern);
    if (match) problems.push(`${r}: contains ${name} ("${match[0]}")`);
  }

  if (!/<a class="skip-link" href="#main"/.test(text) || !/<main id="main"/.test(text)) {
    problems.push(`${r}: missing the "Skip to content" link for keyboard users`);
  }

  const h1 = (text.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${r}: has ${h1} main headings (expected 1)`);

  if (!/<title>[^<]{5,}<\/title>/.test(text)) problems.push(`${r}: missing page title`);
  if (!/<meta name="description" content="[^"]{20,}"/.test(text)) problems.push(`${r}: missing description`);

  const blocked = /<meta name="robots" content="noindex, nofollow"/.test(text);
  if (SITE_IS_PRIVATE && !blocked) problems.push(`${r}: search-engine block is missing`);
  if (!SITE_IS_PRIVATE && blocked) problems.push(`${r}: search-engine block is still on`);

  // Structured data for search engines is plain data, not a program, so it is allowed.
  if (/<script(?![^>]*type="application\/ld\+json")/i.test(text)) {
    problems.push(`${r}: contains a script (the built site should have none)`);
  }

  if (!/<link rel="canonical" href="https:\/\/niloofarrezaei\.com\//.test(text)) problems.push(`${r}: missing canonical address`);
  if (!/<meta property="og:image" content="https:\/\/niloofarrezaei\.com\/og\.png"/.test(text)) {
    problems.push(`${r}: missing link-preview image`);
  }

  for (const m of text.matchAll(/<(?:img|script|link|iframe|video|audio|source)\b[^>]*?\s(?:src|href)="(https?:)?\/\/[^"]+"/g)) {
    if (m[0].includes('rel="canonical"')) continue;
    problems.push(`${r}: loads something from another server: ${m[0].slice(0, 110)}`);
  }

  // An empty alt (written `alt` or `alt=""`) marks a decorative image and is fine. A missing alt is not.
  for (const m of text.matchAll(/<img\b(?![^>]*\salt(?:=|[\s>]))[^>]*>/g)) {
    problems.push(`${r}: image without alt text: ${m[0].slice(0, 90)}`);
  }

  for (const m of text.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [path, hash] = href.split('#');
    const target = path === '' ? r : normalize(path);
    if (!html.has(target) && !isBuiltFile(path)) {
      problems.push(`${r}: broken link to ${href}`);
      continue;
    }
    if (hash && html.has(target) && !idsByRoute.get(target).has(hash)) {
      problems.push(`${r}: link to ${href} points at a missing section`);
    }
  }
}

// Rights gate: the site cannot be published while a photo still awaits permission.
// A document such as the CV cannot be read by this script, so it is checked when it is made.
// scripts/make-public-cv.py removes the private details, checks the result and records its fingerprint.
// Any document without a matching fingerprint is refused, which stops a private original from slipping in.
const approvedFile = new URL('./approved-files.json', import.meta.url);
const approved = existsSync(approvedFile) ? JSON.parse(readFileSync(approvedFile, 'utf8')) : {};
for (const file of documents) {
  const name = relative(DIST, file);
  const fingerprint = createHash('sha256').update(readFileSync(file)).digest('hex');
  if (approved[name]?.sha256 !== fingerprint) {
    problems.push(`${name}: not an approved public file. Make it with scripts/make-public-cv.py, which removes private details and records the result.`);
  }
}

const ledger = readFileSync(new URL('../MEDIA-RIGHTS.md', import.meta.url), 'utf8');
const awaiting = ledger.split('\n').filter((line) => /\|\s*Before launch\s*\|\s*$/.test(line));
if (!SITE_IS_PRIVATE && awaiting.length) {
  problems.push(`MEDIA-RIGHTS.md: ${awaiting.length} item(s) still await permission`);
}

console.log(`Checked ${html.size} pages: ${[...html.keys()].sort().join('  ')}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(' - ' + problem);
  process.exit(1);
}
console.log('No problems found: links, headings, titles, privacy rules, search-engine block, no scripts, nothing loaded from other servers.');
if (awaiting.length) console.log(`Reminder: ${awaiting.length} photo(s) in MEDIA-RIGHTS.md still need permission before launch.`);
