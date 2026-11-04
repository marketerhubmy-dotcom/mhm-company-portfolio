/**
 * Captures REAL screenshots of portfolio demos into a raw folder.
 * Dev-only tool (not part of the site build). Requires Playwright + Chromium.
 *
 *   node scripts/media/capture.cjs <outDir>
 *   python3 scripts/media/optimize.py <outDir> public/projects
 *
 * Add new shots to SHOTS below. Never fabricate screenshots.
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const ERP = 'https://demo-odajah-erp.marketerhubmy.workers.dev';
const AINA = 'https://demo-aina-herb.pages.dev';

const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 };
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

async function erpLogin(page, role) {
  await page.goto(`${ERP}/login`, { waitUntil: 'networkidle' });
  await page.getByText(role, { exact: true }).first().click();
  await page.waitForTimeout(1500);
}
async function erpNav(page, label) {
  await page.locator('aside, nav').getByText(label, { exact: false }).first().click();
  await page.waitForTimeout(1500);
}

const SHOTS = [
  // ---- ODAJAH ERP demo (desktop) ----
  { slug: 'odajah-erp-demo', name: 'login', ctx: desktop, run: async (p) => { await p.goto(`${ERP}/login`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); } },
  { slug: 'odajah-erp-demo', name: 'dashboard-admin', ctx: desktop, run: (p) => erpLogin(p, 'Admin') },
  { slug: 'odajah-erp-demo', name: 'semua-order', ctx: desktop, run: async (p) => { await erpLogin(p, 'Admin'); await erpNav(p, 'Semua Order'); } },
  { slug: 'odajah-erp-demo', name: 'buat-order', ctx: desktop, run: async (p) => { await erpLogin(p, 'Admin'); await erpNav(p, 'Buat Order'); } },
  { slug: 'odajah-erp-demo', name: 'verify-payment', ctx: desktop, run: async (p) => { await erpLogin(p, 'Accounting'); await erpNav(p, 'Verify Payment'); } },
  { slug: 'odajah-erp-demo', name: 'dashboard-logistik', ctx: desktop, run: (p) => erpLogin(p, 'Logistik') },
  { slug: 'odajah-erp-demo', name: 'kehadiran-hr', ctx: desktop, run: async (p) => { await erpLogin(p, 'HR'); await erpNav(p, 'Semak Kehadiran'); } },
  { slug: 'odajah-erp-demo', name: 'whatsapp-team', ctx: desktop, run: async (p) => { await erpLogin(p, 'Admin'); await erpNav(p, 'WhatsApp Team'); } },
  // ---- Aina Herb landing page (mobile-first) ----
  { slug: 'aina-herb-susu-kacha', name: 'hero', ctx: mobile, run: async (p) => { await p.goto(AINA, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500); } },
  { slug: 'aina-herb-susu-kacha', name: 'testimoni', ctx: mobile, run: async (p) => { await p.goto(AINA, { waitUntil: 'networkidle' }); await p.locator('#ulasan').scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -70)); await p.waitForTimeout(1200); } },
  { slug: 'aina-herb-susu-kacha', name: 'cara-minum', ctx: mobile, run: async (p) => { await p.goto(AINA, { waitUntil: 'networkidle' }); await p.getByText('Cara Minum', { exact: true }).first().scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -90)); await p.waitForTimeout(1200); } },
  { slug: 'aina-herb-susu-kacha', name: 'pilih-pakej', ctx: mobile, run: async (p) => { await p.goto(AINA, { waitUntil: 'networkidle' }); await p.getByText('Beli Sekarang · Dari RM110').first().click(); await p.waitForTimeout(1500); } },
  { slug: 'aina-herb-susu-kacha', name: 'butiran', ctx: mobile, run: async (p) => { await p.goto(AINA, { waitUntil: 'networkidle' }); await p.getByText('TENTANG PRODUK INI').first().scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -80)); await p.waitForTimeout(1200); } },
];

(async () => {
  const out = process.argv[2];
  if (!out) { console.error('usage: node scripts/media/capture.cjs <outDir>'); process.exit(1); }
  const browser = await chromium.launch();
  let failed = 0;
  for (const s of SHOTS) {
    const ctx = await browser.newContext(s.ctx);
    const page = await ctx.newPage();
    try {
      await s.run(page);
      const dir = path.join(out, s.slug);
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, `${s.name}.png`) });
      console.log('ok  ', s.slug, s.name);
    } catch (e) { failed++; console.error('FAIL', s.slug, s.name, e.message); }
    await ctx.close();
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
