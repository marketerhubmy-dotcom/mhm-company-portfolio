# UI/UX Reference Audit — najmihamdi.my

Inspected live on 2026-11-04 with Playwright/Chromium at 1440×900 (desktop) and
390×844 (mobile): full scroll capture, computed styles, stylesheet keyframes,
DOM probes for cursor/scroll libraries, mobile menu interaction.
Used as a **quality benchmark only** — no code, assets, copy, branding or page
compositions were copied.

## What was observed

| Area | Observation |
|---|---|
| Art direction | Dark (#050507 bg, #F5F5F7 text), large blurred purple/teal/amber colour fields behind content; multi-colour gradient on accent words. |
| Typography | Space Grotesk display (H1 158px, tracking −0.04em; H2 76px), Inter body 16px, JetBrains Mono 12px uppercase eyebrows (`01 · ABOUT`, 0.2em tracking). Very high scale contrast between display and body. |
| Header | Fixed; pill-shaped centred nav with blur (`blur(20px) saturate(1.8)`, 70% bg); active link underline; resume CTA right. Top scroll-progress bar. |
| Hero | Outline + gradient-fill name, hand-drawn swoosh, portrait cut-out with floating info badges, status pill, two CTAs, count-up stats. |
| Sequencing | Hero → tech marquee → About (bento cards) → Services (3 cards with pricing) → Clients (logo-less name grid) → Products (alternating screenshot/text rows) → Work (thumbnail grid + filterable archive) → Pricing → Contact card → Footer. |
| Motion | CSS keyframes only (`heroRise`, `heroPop`, `drawSwoosh`, `marquee`, `float`, `shimmer`…); ~66 scroll-reveal elements, 0.8s `cubic-bezier(0.16,1,0.3,1)`. No GSAP/Lenis, no scroll hijacking. Custom dot + ring cursor. `prefers-reduced-motion` honoured. |
| Portfolio | Product screenshots inside browser-chrome frames; alternating left/right editorial rows with mono category, H3 52px, 3 bullet features, tech chips, live link. Archive uses category filter pills + "show all" expansion. |
| Mobile | Portrait moves above the name; nav becomes a right-side drawer with large links and divider lines; cards stack to one column; type scales down but stays bold. |

## Principles adopted for MHM Center (re-interpreted, not copied)

1. **Extreme type-scale contrast** — oversized display headlines against calm 16–18px body.
2. **Mono metadata layer** — small uppercase mono labels for indexes, categories and specs.
3. **Screenshots in device/browser frames** — real work, framed, never naked.
4. **Alternating editorial rows for featured work** — one project gets the whole width.
5. **One shared easing curve** (expo-out) for every reveal and hover → coherent feel.
6. **CSS-first motion**, no heavy libraries, reduced-motion respected, no scroll hijack.
7. **Filterable archive** for scale once projects grow.

## Deliberately different

| Reference | MHM Center |
|---|---|
| Dark, neon multi-gradient | Light "paper & ink" editorial palette, **one** accent (Saga red) |
| Space Grotesk / Inter / JetBrains Mono | Bricolage Grotesque / Geist / Geist Mono + Instrument Serif italic accent word |
| Personal brand, portrait hero | Studio brand: interactive "Rajah 01" system-flow schematic |
| Marquee, custom cursor, count-up stats | Not used (no invented numbers; cursor effects add little for SMEs) |
| Card bento grids | Drafting-table column guides, ruled ledgers, indexed lists |
| Fixed pricing cards | Configurable `priceNote` (null → "Sebut harga ikut skop") |
