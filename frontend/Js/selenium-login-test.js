const { Builder, By, until } = require("selenium-webdriver");
const LOGIN_URL = "http://127.0.0.1:5500/Pages/login.html";

const DEFAULT_TIMEOUT = 8000;

async function buildDriver() {
  const driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 10000,
    script: 10000,
  });
  return driver;
}
  async function waitAndType(driver, locator, text) {
  const el = await driver.wait(until.elementLocated(locator), DEFAULT_TIMEOUT);
  await driver.wait(until.elementIsVisible(el), DEFAULT_TIMEOUT);
  await driver.wait(async () => (await el.isEnabled()) === true, DEFAULT_TIMEOUT);
  await driver.executeScript(
    "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
    el
  );
  await el.clear();
  if (text !== undefined && text !== null) {
    await el.sendKeys(text);
  }
  return el;
}
  async function waitAndClick(driver, locator) {
  const el = await driver.wait(until.elementLocated(locator), DEFAULT_TIMEOUT);
  await driver.wait(until.elementIsVisible(el), DEFAULT_TIMEOUT);
  await driver.wait(async () => (await el.isEnabled()) === true, DEFAULT_TIMEOUT);
  await driver.executeScript(
    "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
    el
  );
  await el.click();
  return el;
}
async function getCaptchaCode(driver) {
  const captchaEl = await driver.wait(
    until.elementLocated(By.id("captcha-code")),
    DEFAULT_TIMEOUT
  );
  await driver.wait(until.elementIsVisible(captchaEl), DEFAULT_TIMEOUT);
  const text = await captchaEl.getText();
  return text.trim();
}


