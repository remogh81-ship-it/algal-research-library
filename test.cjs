const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForSelector('.phase2-feature-btn');
  const btns = await page.$$('.phase2-feature-btn');
  for (let b of btns) {
    const text = await b.evaluate(el => el.innerText);
    if (text.includes('Lab') || text.includes('بروتوكول')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.substring(0, 1000));
  await browser.close();
})();
