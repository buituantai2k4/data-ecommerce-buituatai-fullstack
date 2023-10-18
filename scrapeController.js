const scrapers = require('./scraper');
const fs = require('fs');

const scrapeController = async (browserInstance) => {
    const url = 'https://digital-world-2.myshopify.com/';
    try {
        let browser = await browserInstance;
        const categories = await scrapers.scrapeCategory(browser, url);
        const dataToWrite = {};

        for (const category of categories) {
            try {
                const items = await scrapers.scrapeItems(browser, category.link);
                console.log(items);

                const itemData = {};
                for (const item of items) {
                    const rs = await scrapers.scraper(browser, item);
                    itemData[item] = rs;
                }

                dataToWrite[category.category] = itemData;
            } catch (error) {
                console.log('Lỗi khi scrape items: ' + error);
            }
        }
        console.log("THIS IS STRING DATA NEED CONSOLE LOG: ",JSON.stringify(dataToWrite))
        fs.writeFile('ecommerce.json', JSON.stringify(dataToWrite, null, 2), (err) => {
            if (err) {
                console.log('Ghi data vào file JSON thất bại: ' + err);
            } else {
                console.log('Thêm data thành công!');
            }
        });
        

        await browser.close();
    } catch (e) {
        console.log('Lỗi ở scrape controller: ' + e);
    }
}


module.exports = scrapeController