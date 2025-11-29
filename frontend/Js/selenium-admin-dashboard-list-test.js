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
async function main() {
  const options = new chrome.Options();

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    console.log("🚀 Starting admin-dashboard-list tests...\n");

    await driver.get(DASHBOARD_URL);
    await driver.executeScript("window.localStorage.removeItem('sabau-lessons');");
    await driver.navigate().refresh();

    // ========== TEST 1: Initial load & pagination ==========
    console.log("[TEST 1] Initial load & pagination...");

    let rows = await waitForRows(driver);
    console.log(`  Rows on first page: ${rows.length}`);
    if (rows.length !== 5) {
      throw new Error("Expected 5 rows on first page (PAGE_SIZE = 5).");
    }

    const pageIndicatorEl = await driver.findElement(By.css(".table-footer .one"));
    let pageIndicatorText = await pageIndicatorEl.getText();
    console.log(`  Page indicator: ${pageIndicatorText}`);
    if (pageIndicatorText.trim() !== "1") {
      throw new Error("Expected page indicator to be '1' on first page.");
    }

    const pageInfoText1 = await getText(driver, By.css(".table-footer ._1-10-of-14"));
    console.log(`  Page info text: "${pageInfoText1}"`);
    if (!pageInfoText1.includes("of 6")) {
      console.warn("  (Warning) Page info text does not contain 'of 6', but continuing.");
    }

    console.log("✅ TEST 1 PASSED\n");

    

    // ========== TEST 2: Next / Previous page ==========
    console.log("[TEST 2] Next & Previous page buttons...");

    const nextBtn = await driver.findElement(By.css(".table-footer .frame-1"));
    const prevBtn = await driver.findElement(By.css(".table-footer .frame-2"));

    await nextBtn.click();
    await sleep(500);

    rows = await waitForRows(driver);
    console.log(`  Rows on second page: ${rows.length}`);
    if (rows.length < 1 || rows.length > 5) {
      throw new Error("Unexpected number of rows on second page.");
    }

    pageIndicatorText = await pageIndicatorEl.getText();
    console.log(`  Page indicator on second page: ${pageIndicatorText}`);
    if (pageIndicatorText.trim() !== "2") {
      throw new Error("Expected page indicator to be '2' on second page.");
    }

    await prevBtn.click();
    await sleep(500);

    pageIndicatorText = await pageIndicatorEl.getText();
    console.log(`  Page indicator after going back: ${pageIndicatorText}`);
    if (pageIndicatorText.trim() !== "1") {
      throw new Error("Expected page indicator to be '1' after going back to first page.");
    }

    console.log("✅ TEST 2 PASSED\n");

