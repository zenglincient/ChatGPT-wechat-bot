import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: false,
});

const wait = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

console.log('浏览器已启动');

const page = await browser.newPage();
await page.setViewport({
  width: 1200,
  height: 980,
});

await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
);

await page.goto(`https://chat.openai.com/auth/login`);
console.log(`打开页面`);

await wait(3000);

const checkbox = await page.$('#checkbox');

if (checkbox) {
  checkbox.click();
}

// await wait(3000);

// await page.waitForSelector('button');

// page.evaluate(() => {
//   document.querySelector('button').click();
// });

// await page.waitForSelector('#username');

// await wait(3000);

// const userName = page.$('#username');
// userName.type('cheguevara1894@gmail.com');

// await page.waitForSelector('#password');
// await wait(3000);

// const password = page.$('#password');
// password.type('cC1343787');
