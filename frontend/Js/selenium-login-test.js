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
