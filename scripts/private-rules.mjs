// Loads the patterns for the owner's private details from private/forbidden.json.
//
// That file is listed in .gitignore and exists only on the owner's computer. It holds a list like:
//   [{ "name": "phone number", "pattern": "<regular expression>", "flags": "i" }]
// with one entry each for the owner's phone number, referees' surnames and university login name.
// If it is lost, rebuild it from the contact line of the owner's CV and the references page of the faculty packet.
import { existsSync, readFileSync } from 'node:fs';

const FILE = new URL('../private/forbidden.json', import.meta.url);

/** Returns the private rules, or null when the file is not on this computer. */
export function loadPrivateRules() {
  if (!existsSync(FILE)) return null;
  return JSON.parse(readFileSync(FILE, 'utf8')).map((rule) => ({
    name: rule.name,
    pattern: new RegExp(rule.pattern, rule.flags ?? ''),
  }));
}
