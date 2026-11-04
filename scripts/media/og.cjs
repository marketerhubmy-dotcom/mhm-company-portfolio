/** Renders public/og/mhm-center.png (1200×630) from the official logo + brand palette. Dev-only. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const b64 = (p, type) => `data:${type};base64,` + fs.readFileSync(path.join(root, p)).toString('base64');
const font = (fam, file, style = 'normal') => `@font-face{font-family:'${fam}';src:url(${b64('node_modules/' + file, 'font/woff2')}) format('woff2');font-weight:100 900;font-style:${style}}`;
const css = [
  font('B', '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2'),
  font('S', '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'italic'),
  font('M', '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'),
].join('');
const logo = b64('public/brand/mhm-center-logo.png', 'image/png');
const og = `<html><head><style>${css}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#f5f8fc;color:#0a1a33;font-family:B;padding:60px 72px;display:grid;grid-template-columns:1fr 300px;gap:48px;align-items:center;
background-image:linear-gradient(to right,rgba(10,26,51,.08) 1px,transparent 1px);background-size:264px 100%;background-position:72px 0}
.l{display:flex;flex-direction:column;justify-content:space-between;height:100%}
.top{font:500 15px M;letter-spacing:.14em;text-transform:uppercase;color:#5a6b85}
h1{font-size:80px;line-height:.94;letter-spacing:-.045em;font-weight:640}em{font-family:S;font-weight:400;color:#0057d9;letter-spacing:-.02em}
.foot{font:500 14px M;letter-spacing:.12em;text-transform:uppercase;color:#34476a;border-top:1px solid rgba(10,26,51,.26);padding-top:18px}
img{width:300px;height:auto}</style></head>
<body><div class="l"><div class="top">Studio Penyelesaian Digital · Malaysia</div>
<h1>Idea bisnes anda.<br>Kami jadikan sistem<br>yang <em>berfungsi.</em></h1>
<div class="foot">Landing Page · Website · E-Commerce · CRM/ERP · SaaS · Automasi</div></div>
<img src="${logo}" alt=""></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(og, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, 'public/og/mhm-center.png') });
  await b.close();
})();
