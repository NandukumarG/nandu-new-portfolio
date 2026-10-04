const { chromium } = require('playwright');
const fs = require('node:fs');
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5173';
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(base);
    for (const [input, output, width] of [
      ['hero-orbital-system-v3.png', 'hero-orbital-system-v3.webp', 1536],
    ]) {
      const data = await page.evaluate(async ({ input, width }) => {
        const image = new Image(); image.src = '/images/' + input; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = Math.round(image.height * width / image.width);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/webp', .9).split(',')[1];
      }, { input, width });
      const buffer = Buffer.from(data, 'base64');
      fs.writeFileSync('public/images/' + output, buffer);
      console.log(output, Math.round(buffer.length / 1024) + ' KB');
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
