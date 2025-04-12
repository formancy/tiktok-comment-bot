import { Actor } from 'apify';
import { chromium } from 'playwright';

Actor.main(async () => {
    const input = await Actor.getInput();
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Log in manually once — cookies will be saved
    await page.goto('https://www.tiktok.com/login');
    await page.waitForTimeout(25000); // wait for manual login

    const cookies = await page.context().cookies();
    await Actor.setValue('cookies', cookies); // save for reuse

    const videoUrl = input.videoUrl;
    const baitComment = input.baitComment;
    const replyComment = input.replyComment;

    await page.goto(videoUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    const commentBoxSelector = 'div.public-DraftEditor-content';

    try {
        await page.click(commentBoxSelector);
        await page.keyboard.type(baitComment);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);

        if (replyComment) {
            await page.waitForTimeout(8000);
            await page.keyboard.type(replyComment);
            await page.keyboard.press('Enter');
        }
    } catch (err) {
        console.error('Failed to comment:', err);
    }

    await browser.close();
});
