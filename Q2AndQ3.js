const { chromium } = require('playwright');
async function fetchRecipes() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.foodnetwork.com/recipes/recipes-a-z/s');
    const dismissModalSelector = 'a.o-InternationalDialog__a-Button--Text[data-dismiss="international-modal"]';
    if (await page.isVisible(dismissModalSelector)) {
      await page.click(dismissModalSelector);
    }
    let allURLs = [];

    for (let i = 0; i < 5; i++) {
      await page.waitForSelector('.o-Capsule__m-Body');
      const urls = await page.$$eval('.m-PromoList.o-Capsule__m-PromoList a[href]', links => links.map(a => a.href));
      allURLs.push(...urls);
      if (i < 4) {
        await page.click('a.o-Pagination__a-NextButton');
        await page.waitForLoadState('networkidle');
      }
    }

    console.log('Collected URLs:', allURLs);
    await browser.close();
    containsSoup(allURLs);
    return allURLs;
  }

  fetchRecipes().then(allURLs => {
    console.log('Total URLs collected:', allURLs.length);
  }).catch(error => {
    console.error('Error fetching URLs:', error);
  });

function containsSoup(urls) {
    const soupRegex = /soup/i;
    const soupUrls = urls.filter(url => soupRegex.test(url));
    console.log(soupUrls);
}