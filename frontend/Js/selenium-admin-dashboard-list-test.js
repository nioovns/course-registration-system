const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const DASHBOARD_URL = "http://127.0.0.1:5500/Pages/admin-dashboard-list.html";
const LOGIN_URL_FRAGMENT = "login.html";
const ADD_LESSON_URL_FRAGMENT = "add-lesson.html";

async function waitForRows(driver, timeout = 5000) {
  await driver.wait(until.elementsLocated(By.css(".datatable .tbody .tr2")), timeout);
  return driver.findElements(By.css(".datatable .tbody .tr2"));
}

async function getText(driver, locator) {
  const el = await driver.findElement(locator);
  return el.getText();
}

async function clickWhenVisible(driver, locator, timeout = 5000) {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);
  await el.click();
  return el;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

