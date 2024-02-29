const puppeteer = require('puppeteer');

async function getItemPrice(itemName) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://tarkov-market.com/item/${itemName}`);

    const searchInputSelector = 'input[placeholder="Search"]';
    await page.waitForSelector(searchInputSelector);
    
    await page.waitForSelector('div.w-25')
    const data = await page.evaluate( async () => {
        
        let getAllPrices = Array.from(document.querySelectorAll('div.w-25'));
        
        let traderPrice = '';
        let fleaPrice = '';
        fleaPrice = getAllPrices.filter( d => d.innerText.includes('Flea price'))[0].innerText.split('\n')[1];
        traderPrice = getAllPrices.filter( d => d.innerText.includes('Sell to trader'))[0].innerText.split('\n')[2];

        return {
            traderPrice,
            fleaPrice
        }
    })

    await browser.close();

    return {
        itemName,
        ...data
    }
};

module.exports = {
    getItemPrice
}