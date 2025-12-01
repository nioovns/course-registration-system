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
