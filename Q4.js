const { chromium } = require('playwright');
async function fetchRecipeDetails() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.foodnetwork.com/recipes/michael-chiarello/super-tuscan-white-bean-soup-recipe-1947697');
    const dismissModalSelector = 'a.o-InternationalDialog__a-Button--Text[data-dismiss="international-modal"]';
    if (await page.isVisible(dismissModalSelector)) {
      await page.click(dismissModalSelector);
    }
    const author = await page.textContent('.o-Attribution__a-Author--Prefix a');
    console.log(author);
    const ingredients = await page.$$eval('.o-Ingredients__m-Body .o-Ingredients__a-Ingredient', elements =>
        elements.map(el => el.textContent.trim())
    );
    const instructions = await page.$$eval('.o-Method__m-Body ol > li', elements =>
        elements.map(el => el.textContent.trim())
    );

    await browser.close();
    console.log("this is first ingredients => " + ingredients[0]);
    return [author, ...ingredients, ...instructions];
}
fetchRecipeDetails()
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));