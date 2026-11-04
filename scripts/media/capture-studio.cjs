/**
 * Captures MHM AI Content Studio from its DISPOSABLE local demo (temporary
 * database, random password, no .env, no customer data). Dev-only.
 *
 *   # terminal 1, in a checkout of marketerhubmy-dotcom/mhm-ai-content-studio:
 *   npm ci && npm run demo > demo.log
 *   # terminal 2:
 *   node scripts/media/capture-studio.cjs <path/to/demo.log> <outDir>
 *   python3 scripts/media/optimize.py <outDir> public/projects
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const [logFile, outRoot] = process.argv.slice(2);
if (!logFile || !outRoot) { console.error('usage: capture-studio.cjs <demo.log> <outDir>'); process.exit(1); }
const password = fs.readFileSync(logFile, 'utf8').match(/Password: (\S+)/)?.[1];
if (!password) { console.error('demo password not found in log'); process.exit(1); }
const out = path.join(outRoot, 'mhm-ai-content-studio');
fs.mkdirSync(out, { recursive: true });
const BASE = 'http://127.0.0.1:3118';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const shot = async (name, scrollText) => {
    await page.evaluate(() => scrollTo(0, 0));
    if (scrollText) { await page.getByText(scrollText).first().scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, -140)); }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(out, `${name}.png`) });
    console.log('ok  ', name);
  };
  const click = async (text) => { await page.locator('button:visible, a:visible', { hasText: text }).first().click(); await page.waitForTimeout(1200); };

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await shot('log-masuk');
  await page.fill('input[type=email], input[name=email]', 'admin@studio.test');
  await page.fill('input[type=password]', password);
  await Promise.all([page.waitForLoadState('networkidle'), page.locator('button[type=submit], form button').first().click()]);
  await page.waitForTimeout(2000);
  await shot('brand-product');
  await shot('import-produk', 'Tambah jenama / produk melalui link');
  await click('02 Gaya Video'); await shot('gaya-video');
  await click('03 CTA & Branding'); await shot('cta-branding');
  for (const [sub, name] of [['Import link TikTok Shop', 'tiktok-affiliate'], ['Video bebas & storytelling', 'open-creative'], ['Katalog & template contoh', 'library']]) {
    await page.evaluate(() => scrollTo(0, 0));
    await page.getByText(sub, { exact: true }).first().click();
    await page.waitForTimeout(1500);
    await shot(name);
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
