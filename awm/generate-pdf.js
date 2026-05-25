const puppeteer = require('puppeteer');
const path = require('path');

const htmlPath = path.join(__dirname, 'problemy-awm-report.html');
const pdfPath = path.join(__dirname, 'problemy-awm-report.pdf');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', right: '12mm', bottom: '14mm', left: '12mm' },
  });
  await browser.close();
  console.log('PDF:', pdfPath);
})();
