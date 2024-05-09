const { chromium } = require('playwright');
async function fetchUrls (){
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.foodnetwork.com/recipes');
    const dismissModalSelector = 'a.o-InternationalDialog__a-Button--Text[data-dismiss="international-modal"]';
    if (await page.isVisible(dismissModalSelector)) {
      await page.click(dismissModalSelector);
    }
    const loadMoreSelector = 'button.o-Capsule__a-Button[data-type="load-more-btn"]';
    while (await page.isVisible(loadMoreSelector)) {
      await page.evaluate(selector => {
        const button = document.querySelector(selector);
        button.scrollIntoView();
      }, loadMoreSelector);
      await page.click(loadMoreSelector);
      await page.waitForLoadState('networkidle');

    }
    const urls = await page.$$eval('.o-Capsule__m-MediaBlock a[href]', links => links.map(a => a.href));
    console.log('No more items to load.');
    await browser.close();
    return urls;
}
fetchUrls().then(urls => {
    console.log('Collected URLs:', urls);
}).catch(error => {
    console.error('Error fetching URLs:', error);
});
