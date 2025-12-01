const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function forceClick(driver, selector) {
  const el = await driver.wait(until.elementLocated(By.css(selector)), 6000);
  await driver.wait(until.elementIsVisible(el), 6000);
  await driver.sleep(150);
  await driver.executeScript("arguments[0].scrollIntoView(true);", el);
  await driver.sleep(100);
  await driver.executeScript("arguments[0].click();", el);
  return el;
}
async function getLessonsCount(driver) {
    return await driver.executeScript(`
        try {
            const raw = localStorage.getItem("sabau-lessons");
            if (!raw) return 0;

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return 0;

            return parsed.length;
        } catch (e) {
            return 0;
        }
    `);
}