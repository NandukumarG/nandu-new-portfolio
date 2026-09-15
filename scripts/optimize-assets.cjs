const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174');
  for (const [input, output, width] of [
    ['orbital-hero.png', 'orbital-hero.webp', 1774],
    ['orbital-hero.png', 'orbital-hero-mobile.webp', 960],
    ['developer-workstation.png', 'developer-workstation.webp', 900],
    ['house-formstudio.jpg', 'form-studio.webp', 900],
    ['lake-fieldnotes.jpg', 'field-notes.webp', 900],
    ['lake-civicmaps.jpg', 'civic-maps.webp', 900],
    ['forest-fieldops.jpg', 'trail-index.webp', 900],
  ]) {
    const data = await page.evaluate(async ({ input, width }) => {
      const img = new Image(); img.src = '/images/' + input; await img.decode();
      const c = document.createElement('canvas'); c.width = Math.min(width, img.width); c.height = Math.round(img.height * c.width / img.width);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', .87).split(',')[1];
    }, { input, width });
    fs.writeFileSync('public/images/' + output, Buffer.from(data, 'base64'));
    console.log(output, Math.round(Buffer.from(data, 'base64').length / 1024) + ' KB');
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
