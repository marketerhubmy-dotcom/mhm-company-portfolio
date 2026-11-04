/** Renders public/og/mhm-center.png (1200×630) and public/apple-touch-icon.png. Dev-only. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const nm = (p) => 'data:font/woff2;base64,' + fs.readFileSync(path.resolve(__dirname, '../../node_modules', p)).toString('base64');
const font = (fam, file, style = 'normal') => `@font-face{font-family:'${fam}';src:url(${nm(file)}) format('woff2');font-weight:100 900;font-style:${style}}`;
const css = [
  font('B', '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2'),
  font('S', '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'italic'),
  font('M', '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'),
].join('');
const mark = fs.readFileSync(path.resolve(__dirname, '../../public/favicon.svg'), 'utf8');
const og = `<html><head><style>${css}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#f3f0e8;color:#121311;font-family:B;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;
background-image:linear-gradient(to right,rgba(18,19,17,.1) 1px,transparent 1px);background-size:264px 100%;background-position:72px 0}
.top{display:flex;align-items:center;gap:16px;font:500 15px M;letter-spacing:.14em;text-transform:uppercase;color:#66655d}.top svg{width:44px;height:44px}
h1{font-size:108px;line-height:.92;letter-spacing:-.045em;font-weight:640}em{font-family:S;font-weight:400;color:#ae3617;letter-spacing:-.02em}
.foot{display:flex;justify-content:space-between;font:500 15px M;letter-spacing:.12em;text-transform:uppercase;color:#45463f;border-top:1px solid rgba(18,19,17,.28);padding-top:20px}</style></head>
<body><div class="top">${mark}<span style="color:#121311">MHM CENTER</span><span>— Studio Penyelesaian Digital</span></div>
<h1>Idea bisnes anda.<br>Kami jadikan sistem<br>yang <em>berfungsi.</em></h1>
<div class="foot"><span>Landing Page · Website · E-Commerce · CRM/ERP · SaaS · Automasi AI</span><span>Malaysia</span></div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(og, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'public/og/mhm-center.png' });
  const i = await b.newPage({ viewport: { width: 180, height: 180 } });
  await i.setContent(`<body style="margin:0">${mark.replace('<svg ', '<svg width="180" height="180" ')}</body>`);
  await i.screenshot({ path: 'public/apple-touch-icon.png' });
  await b.close();
})();
