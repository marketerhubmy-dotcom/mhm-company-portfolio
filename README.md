# MHM CENTER — Portfolio Rasmi (V2)

Official portfolio of **MHM CENTER**, a Malaysian digital solutions & technology development studio.
React 19 + Vite + TypeScript + Tailwind CSS v4, prerendered to static HTML, hosted on Cloudflare Pages Free,
with a GitHub-Actions-driven **portfolio auto-sync**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + tests + production build
npm run preview    # serve the built site on http://localhost:4173
```

Copy `.env.example` to `.env.local` to set WhatsApp/email for local testing.

## Pages

| Route | Page |
|---|---|
| `/` | Homepage (hero, kerja terpilih, keupayaan, masalah & penyelesaian, servis, proses, teknologi, tentang, FAQ, CTA) |
| `/kerja` | Portfolio: search, category/status filters (URL-synced), grid & index views |
| `/kerja/:slug` | Case study (prerendered, JSON-LD, gallery lightbox, demo notes, related) |
| `/servis` | 8 services: who, problems, deliverables, examples, configurable price note |
| `/tentang` | Company profile & MHM Academy |
| `/hubungi` | Requirements form → prefilled WhatsApp message (copy fallback) |

## Structure

```
content/projects/      manual project entries (one JSON per project)
content/approvals.json approval registry for GitHub-discovered repos
content/synced/        last valid snapshots of approved discovered repos
schema/                JSON Schema for .mhm-portfolio.json
scripts/               sync-portfolio, validate-content, prerender, media/ (screenshot tools)
src/                   components, layouts, pages, sections, features, data, hooks, utils, styles
tests/                 vitest: schema, sync engine, GitHub client, filtering, contact message
.github/workflows/     portfolio-sync.yml (6-hourly + manual), ci.yml
```

## Adding projects

- **Manual / private work:** add `content/projects/<slug>.json` + screenshots in `public/projects/<slug>/`.
  Capture real screenshots with `node scripts/media/capture.cjs <dir>` and
  `python3 scripts/media/optimize.py <dir> public/projects`.
- **From another public repo:** see [docs/AUTO-SYNC.md](docs/AUTO-SYNC.md).

Nothing is public until `approvedForPublic` is `true` (manual) or approved in `content/approvals.json` (discovered).

## Docs

- [docs/REFERENCE-AUDIT.md](docs/REFERENCE-AUDIT.md) — design reference study
- [docs/AUTO-SYNC.md](docs/AUTO-SYNC.md) — sync behaviour & approval flow
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Cloudflare Pages configuration & checklist
