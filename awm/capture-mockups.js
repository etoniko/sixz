const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, 'photo');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const htmlPath = path.join(__dirname, 'multi-mockup.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const shots = [
  { id: 'm1', file: 'multi-close.png' },
  { id: 'm2', file: 'multi-bind-place.png' },
  { id: 'm3', file: 'multi-bind-product.png' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 500, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  for (const s of shots) {
    const el = await page.$(`#${s.id}`);
    await el.screenshot({ path: path.join(dir, s.file) });
    console.log('OK', s.file);
  }

  await page.screenshot({
    path: path.join(dir, 'multi-all.png'),
    fullPage: true,
  });
  console.log('OK multi-all.png');

  await browser.close();
})();
