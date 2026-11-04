/**
 * Captures REAL screenshots of portfolio demos into a raw folder.
 * Dev-only tool (not part of the site build). Requires Playwright + Chromium.
 *
 *   node scripts/media/capture.cjs <outDir> [slug]
 *   python3 scripts/media/optimize.py <outDir> public/projects
 *
 * Add new shots to SHOTS below. Never fabricate screenshots.
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const ERP = 'https://demo-odajah-erp.marketerhubmy.workers.dev';
const AINA = 'https://demo-aina-herb.pages.dev';
const SMS = 'https://sms.mhmacademy.site';
const SYNAX = 'https://synaxhq.site';
const ACADEMY = 'https://mhmacademy.site';

/** MHM Academy shows live "X telah membeli ..." purchase toasts with buyer names.
 *  Those are personal data: hide them before any capture. */
async function academy(page, anchor) {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const st = document.createElement('style');
      st.textContent = '.purchase-popup{display:none!important}';
      document.head.appendChild(st);
    });
  });
  await page.goto(ACADEMY, { waitUntil: 'networkidle' });
  if (anchor) { await page.getByText(anchor).first().scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -80)); }
  await page.waitForTimeout(2500);
  // innerText only contains rendered text, so this catches any visible buyer toast.
  if (await page.evaluate(() => /telah membeli/i.test(document.body.innerText))) throw new Error('purchase toast still visible — refusing to capture');
}

/** Live client site: block ads pixels and the client ERP so captures never create
 *  fake page views, leads or prospects. Never type into its order form. */
async function synax(page, path, anchor) {
  await page.route(/facebook\.(net|com)|rolevisionerp\.com|googletagmanager|google-analytics/, (r) => r.abort());
  // Hide the live site's promo popup so it never covers a capture (not part of this project).
  await page.addInitScript(() => {
    const css = '.vv{display:none!important}';
    document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); });
  });
  await page.goto(`${SYNAX}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  if (anchor) {
    await page.locator(anchor).first().scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.waitForTimeout(1200);
  }
}

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
  // ---- MHM SMS (public pages only — never log in) ----
  { slug: 'mhm-sms', name: 'laman-utama', ctx: desktop, run: async (p) => { await p.goto(SMS, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); } },
  { slug: 'mhm-sms', name: 'harga-stok', ctx: desktop, run: async (p) => { await p.goto(`${SMS}/harga`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500); } },
  { slug: 'mhm-sms', name: 'cara-guna', ctx: desktop, run: async (p) => { await p.goto(`${SMS}/cara-guna`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); } },
  { slug: 'mhm-sms', name: 'daftar', ctx: desktop, run: async (p) => { await p.goto(`${SMS}/daftar`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); } },
  // ---- SYNAX landing pages (client site, mobile-first) ----
  { slug: 'synax-landing-page', name: 'prasekolah', ctx: mobile, run: (p) => synax(p, '/lp/prasekolah') },
  { slug: 'synax-landing-page', name: 'sekolah-rendah', ctx: mobile, run: (p) => synax(p, '/lp/sekolah-rendah') },
  { slug: 'synax-landing-page', name: 'spm', ctx: mobile, run: (p) => synax(p, '/lp/spm') },
  { slug: 'synax-landing-page', name: 'semakan-interaktif', ctx: mobile, run: async (p) => {
      await synax(p, '/lp/sekolah-rendah', 'text=SAYA PUN!');
      const btns = p.getByText('SAYA PUN!');
      for (const i of [0, 1, 3]) await btns.nth(i).tap();
      await p.waitForTimeout(900);
    } },
  { slug: 'synax-landing-page', name: 'pilih-pakej', ctx: mobile, run: (p) => synax(p, '/lp/spm', '#pakej') },
  { slug: 'synax-landing-page', name: 'borang-pesanan', ctx: mobile, run: (p) => synax(p, '/lp/spm', '#order') },
  // ---- MHM Academy (public pages only) ----
  { slug: 'mhm-academy', name: 'laman-utama', ctx: desktop, run: (p) => academy(p) },
  { slug: 'mhm-academy', name: 'katalog-modul', ctx: desktop, run: (p) => academy(p, 'Pilih modul ikut masalah') },
  { slug: 'mhm-academy', name: 'cara-beli', ctx: desktop, run: (p) => academy(p, 'Tiga langkah ringkas') },
];

(async () => {
  const out = process.argv[2];
  if (!out) { console.error('usage: node scripts/media/capture.cjs <outDir>'); process.exit(1); }
  const browser = await chromium.launch();
  let failed = 0;
  const only = process.argv[3]; // optional: capture a single project slug
  for (const s of SHOTS.filter((x) => !only || x.slug === only)) {
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
