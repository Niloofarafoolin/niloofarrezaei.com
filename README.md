# niloofarrezaei.com

Personal academic website of Niloofar Rezaei. Static site built with [Astro](https://astro.build).

## Status: published

The site is live at <https://niloofarrezaei.com>. It went public on 24 November 2026, when the owner said "publish".

- Each change to the `main` branch is built and published by `.github/workflows/deploy.yml`.
- This repository is public. Nothing private may be added to it; the rules below say what that means.
- Run `npm run verify` before every push. It needs the private patterns file described below.

## Rules for content

- Every claim must match the owner's current CV and faculty packet (the versions of 24 November 2026). Future work is never worded as a result.
- Older versions of those documents do not override the current ones.
- A claim never goes beyond its paper. Framework papers "propose". The 2025 IISE paper is a feasibility study. A manuscript under review is never called accepted, and its tracking number is not shown.
- The Blue Sky award is always described as a team award: a six-person UGA entry, with the owner as first-listed member and presenter.
- No citation counts or h-index.
- The lab is the “Price Industries Innovation Factory”, its official name, as in the owner's CV. Use the full name on first mention; “Innovation Factory” is fine after that.
- Write about the owner by name or as “the owner”. Do not assume pronouns.
- The papers' PDFs are not hosted here; link to the publisher.
- The public CV is made with `python3 scripts/make-public-cv.py "<master CV.pdf>"`, which removes the private contact details and checks the result. Never copy a CV into `public/` by hand: `npm run verify` refuses any document it has no record of.
- Never on the site: referees, phone number, personal email, university login name, visa status, home address. `npm run verify` checks for these. The patterns for the owner's own details are kept in `private/`, which is never committed.
- Every image needs an entry in `MEDIA-RIGHTS.md` before it is added.
- The site must work for visitors in Iran: fonts are self-hosted, and there are no third-party scripts, embeds or analytics.

## Run it locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev      # http://localhost:4321
npm run check    # type and template check
npm run build    # writes the static site to dist/
npm run preview  # serves dist/ at http://localhost:4322
```

## Where things are

| What | Where |
| --- | --- |
| Name, links, thesis, thrusts, awards, job-market switch | `src/data/program.ts` |
| Publications | `src/data/publications.ts` |
| Completed and ongoing projects | `src/data/projects.ts` |
| Teaching and mentoring | `src/data/teaching.ts` |
| Bio, education, appointments, talks, service | `src/data/cv.ts` |
| Interactive figures (home and Research pages) | `src/components/figures/`, `src/styles/figures.css` |
| Awards section on the home page | `src/components/site/Recognition.astro`, `src/styles/recognition.css` |
| Portrait (optional) | `src/assets/headshot.jpg`, added with `node scripts/add-portrait.mjs <photo>` |
| Photos and their captions | `src/data/photos.ts`, `src/assets/photos/` |
| Public CV | `public/Niloofar_Rezaei_CV.pdf`, made by `scripts/make-public-cv.py` |
| Design tokens and home page styles | `src/styles/site.css` |
| Inner page styles | `src/styles/pages.css` |

To end the job search notice, set `jobMarket.show` to `false` in `src/data/program.ts`.

The interactive figures are drawn for this site. Where a line, a bar or a meter in one of them is not data, its caption says so.

## Rights

© 2026 Niloofar Rezaei. The text, figures and photographs of this site are not licensed for reuse.
Photographs credited to Jason Loudermilk Photography are his, and are shown with credit. `MEDIA-RIGHTS.md` lists the
source of every image.
