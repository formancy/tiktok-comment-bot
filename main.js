const { chromium } = require('playwright');

Apify.main(async () => {
    const input = await Apify.getInput();
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Log in manually once — cookies will be saved
    await page.goto('https://www.tiktok.com/login');
    await page.waitForTimeout(25000);

    const cookies = await page.context().cookies();
    await Apify.setValue('cookies', cookies);

    const videoUrl = input.videoUrl;
    const baitComment = input.baitComment;
    const replyComment = input.replyComment;

    await page.goto(videoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    const commentBoxSelector = 'div.public-DraftEditor-content';
    await page.click(commentBoxSelector);
    await page.keyboard.type(baitComment);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    if (replyComment) {
        await page.waitForTimeout(8000);
        await page.keyboard.type(replyComment);
        await page.keyboard.press('Enter');
    }

    await browser.close();
});
