const puppeteer = require('puppeteer');

async function getGoonLocation() {

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto(`https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR-wIQI351UH85ILq5KiCLMMrl0uHRmjDinBCt6nXGg5exeuCxQUf8DTLJkwn7Ckr8-HmLyEIoapBE5/pubhtml/sheet?headers=false&gid=1420050773`);
    
    await page.waitForSelector('td.s0');
    const location = await page.evaluate( async () => {
        
        let cells = Array.from(document.querySelectorAll('td.s0'));
        
        location = cells[3].innerText;
        traderPrice = getAllPrices.filter( d => d.innerText.includes('Sell to trader'))[0].innerText.split('\n')[2];

        return location
    })

    await browser.close();

    return location
};

module.exports = {
    getGoonLocation
}