const constants = require('./constants');
const puppeteer = require('puppeteer');



async function handleSocketEvents(socket, page) {
    socket.on(constants.MOUSE_MOVE, async ({ x, y, scroll }) => {
        if (!scroll) {
            await page.mouse.move(x, y);
        } else {
            const scrollY = y > 0 ? 1 : -1;
            await page.evaluate((scrollY) => {
                window.scrollBy(0, scrollY);
            }, scrollY);
        }
    });

    socket.on(constants.MOUSE_CLICK, async ({ button, double }) => {
        console.log('click', button);
        await page.mouse.click(0, 0, { button, clickCount: double ? 2 : 1 });
    });
}


module.exports = handleSocketEvents;