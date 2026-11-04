# GitHub Auto-Sync

New projects appear on the portfolio **without editing React code**, but only
after an explicit approval in this repository.

```
 repo with topic "mhm-portfolio"        content/projects/*.json (manual, incl. private work)
 + .mhm-portfolio.json                                  │
          │  (GitHub Actions, every ~6h / manual)        │
          ▼                                              ▼
   validate (schema.ts) ──► approvals.json ──► merge + dedupe ──► src/data/portfolio.generated.json
          │                    (gate)                                   │
          └─► content/synced/<owner>__<repo>.json (last good copy)      └─► commit only if changed
                                                                              └─► Cloudflare Pages build
```

## Add a project from another repository

1. In that **public** repository add the topic `mhm-portfolio`.
2. Add `.mhm-portfolio.json` at the repo root (see `docs/example.mhm-portfolio.json`,
   schema in `schema/project.schema.json`). Images must be committed in that same
   repo and referenced via `raw.githubusercontent.com/<owner>/<repo>/…` with
   `width`/`height`, or committed here under `public/projects/<slug>/`.
3. Run **Actions → Portfolio Sync → Run workflow** (or wait for the schedule).
   The job summary lists it under *Menunggu kelulusan* — it is **not public yet**.
4. Approve it here in `content/approvals.json`:
   ```json
   { "repositories": {
       "marketerhubmy-dotcom/contoh-crm-klinik": {
         "approvedForPublic": true, "approvedBy": "…", "approvedAt": "2026-11-05",
         "featured": false, "displayOrder": 40,
         "overrides": { "title": "Tajuk editorial (pilihan)" }
   } } }
   ```
   Committing this file to `main` triggers the sync immediately.

To unpublish: set `approvedForPublic: false` (takes effect even offline) or remove the topic.

## Private repositories / client work

Private repositories are **never read or published** (and their names are not
logged — Actions logs of a public repo are public). Add an explicitly approved
manual entry instead: `content/projects/<slug>.json` with `approvedForPublic: true`
and screenshots in `public/projects/<slug>/`. No source code is involved.

## Guarantees

| Requirement | How |
|---|---|
| Explicit approval | Repo's own `approvedForPublic` is ignored; only `content/approvals.json` publishes. |
| Default not public | Validator defaults `approvedForPublic` to `false`. |
| Editorial control | Registry `featured`, `displayOrder`, `status`, `overrides` win over repo metadata. |
| No duplicates | Dedupe by slug and repository; manual entries win. |
| GitHub outage | Discovery failure → previous synced entries kept, nothing removed. Per-repo read failure / invalid metadata → last valid snapshot kept. |
| Update only on change | Deterministic sorted JSON, no timestamps; workflow commits only on a real diff. |
| No loops | Commits made with `GITHUB_TOKEN` don't trigger workflows; only `main` + `content/approvals.json` push triggers sync. |
| Safe content | Unknown keys dropped, control/bidi characters stripped, length limits, https-only demo URLs (no IP/localhost/credentials), image hosts restricted, owner restricted to `marketerhubmy-dotcom`, rendered as text (no `dangerouslySetInnerHTML`). |
| No secrets in frontend | Token used only in the Action; site reads a static JSON file. |
| Errors visible | `::error::`/`::warning::` annotations + a job summary table. Invalid **manual** entries fail the run. |

## Commands

```bash
npm run portfolio:sync              # online (needs network; token optional)
npm run portfolio:sync -- --dry-run # report only
npm run portfolio:compile           # offline compile (runs before dev/build)
npm run validate                    # publication gate
```

Optional secret `PORTFOLIO_SYNC_TOKEN`: fine-grained PAT, public repos read-only,
for higher rate limits. Not required.
