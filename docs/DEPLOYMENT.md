# Deployment — Cloudflare Pages (Free)

The site is fully static (prerendered HTML + assets). It does not use the OVH VPS.

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Production branch | `main` |
| Node version | env `NODE_VERSION=22` |

### Environment variables (all public, baked into HTML/JS)

| Name | Example | Notes |
|---|---|---|
| `VITE_SITE_URL` | `https://web.mhmacademy.site` | canonical, OG, sitemap |
| `VITE_WHATSAPP_NUMBER` | `601111141772` | digits only; defaults to this number when empty |
| `VITE_CONTACT_EMAIL` | `support@mhmacademy.site` | defaults to this address when empty |
| `VITE_ACADEMY_URL` | `https://mhmacademy.site` | |

## Routing

`scripts/prerender.ts` writes `dist/kerja.html`, `dist/kerja/<slug>.html`, … which
Cloudflare Pages serves at `/kerja`, `/kerja/<slug>` (no trailing slash). A real
`dist/404.html` is served with HTTP 404 for unknown paths (no SPA fallback needed).
`_headers` sets CSP (inline script hashed), security headers and long-lived caching
for hashed assets. `sitemap.xml` and `robots.txt` are generated.

## Checklist

- [ ] Merge to `main` (repo default branch).
- [ ] Cloudflare → Workers & Pages → Create → Pages → Connect to Git → `mhm-company-portfolio`.
- [ ] Apply the settings and variables above; deploy; check the `*.pages.dev` preview.
- [ ] Confirm WhatsApp number & email, set variables, redeploy.
- [ ] Custom domains → add `web.mhmacademy.site` (Cloudflare creates the CNAME if the zone is on Cloudflare). **DNS change — needs owner approval.**
- [ ] Repo → Settings → Actions → General → Workflow permissions: *Read and write* (for Portfolio Sync commits).
- [ ] Optionally add secret `PORTFOLIO_SYNC_TOKEN`.
- [ ] Run *Portfolio Sync* once manually and read the job summary.
