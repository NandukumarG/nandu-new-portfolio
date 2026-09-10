const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const el = await page.$('.stack3d-wrap');
  await el.screenshot({ path: 'C:/Users/nanda/AppData/Local/Temp/claude/d--Nandu-portfolio/7e26d364-6865-4c17-8b65-8339edc69971/scratchpad/hero3d.png' });
  await page.screenshot({ path: 'C:/Users/nanda/AppData/Local/Temp/claude/d--Nandu-portfolio/7e26d364-6865-4c17-8b65-8339edc69971/scratchpad/full.png' });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await browser.close();
  console.log('done', errors);
})();
