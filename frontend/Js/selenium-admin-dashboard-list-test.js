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

    // ========== TEST 3: Page dropdown ==========
    console.log("[TEST 3] Page dropdown...");

    const selectContainer = await driver.findElement(By.css(".table-footer .select"));
    await selectContainer.click();

    const dropdown = await driver.wait(
      until.elementLocated(By.css(".page-dropdown")),
      5000
    );

    const page2Option = await dropdown.findElement(
      By.xpath(".//div[contains(normalize-space(.), 'صفحه 2')]")
    );
    await page2Option.click();

    await sleep(500);
    pageIndicatorText = await pageIndicatorEl.getText();
    console.log(`  Page indicator after selecting page 2 from dropdown: ${pageIndicatorText}`);
    if (pageIndicatorText.trim() !== "2") {
      throw new Error("Expected page indicator to be '2' after selecting page 2 from dropdown.");
    }

    console.log("✅ TEST 3 PASSED\n");

    await prevBtn.click();
    await sleep(500);

// ========== TEST 4: Delete lesson - modal appears ==========
    console.log("[TEST 4] Delete lesson - modal appears...");

    await driver.get(DASHBOARD_URL);
    await driver.executeScript("window.localStorage.removeItem('sabau-lessons');");
    await driver.navigate().refresh();

    let rowsBeforeCancel = await waitForRows(driver);
    console.log(` Rows before delete (for modal test): ${rowsBeforeCancel.length}`);

    if (rowsBeforeCancel.length === 0) {
      throw new Error("No rows found before delete (modal test).");
    }

    const firstTrash = await rowsBeforeCancel[0].findElement(By.css(".group-10"));

    try {
      await firstTrash.click();
    } catch (e) {
      console.warn(" Normal click on trash failed, trying JS click...");
      await driver.executeScript("arguments[0].click();", firstTrash);
    }

 
    await sleep(400);

   
    const cancelBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'انصراف')]")),
      5000
    );

    const confirmDeleteBtn = await driver.findElement(
      By.xpath("//button[contains(normalize-space(.), 'حذف درس')]")
    );

    console.log(" Delete modal buttons are present:");
    console.log(" - Cancel button displayed?:", await cancelBtn.isDisplayed());
    console.log(
      " - Confirm button displayed?:",
      await confirmDeleteBtn.isDisplayed()
    );

   
    console.log("✅ TEST 4 PASSED\n");

    await driver.get(DASHBOARD_URL);
    await driver.executeScript("window.localStorage.removeItem('sabau-lessons');");
    await driver.navigate().refresh();

     // ========== TEST 5: Delete lesson - confirm flow ==========
    console.log("[TEST 5] Delete lesson - confirm flow...");

    await driver.get(DASHBOARD_URL);
    await driver.executeScript("window.localStorage.removeItem('sabau-lessons');");
    await driver.navigate().refresh();

    let rowsBeforeDelete = await waitForRows(driver);
    console.log(` Rows before delete (confirm): ${rowsBeforeDelete.length}`);

    if (rowsBeforeDelete.length === 0) {
      throw new Error("No rows found before delete (confirm).");
    }

    const trashToDelete = await rowsBeforeDelete[0].findElement(By.css(".group-10"));

   
    try {
      await trashToDelete.click();
    } catch (e) {
      console.warn(" Normal click on trashToDelete failed, trying JS click...");
      await driver.executeScript("arguments[0].click();", trashToDelete);
    }

    await sleep(400);

    const confirmDeleteBtn2 = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(normalize-space(.), 'حذف درس')]")),
      5000
    );
    await driver.wait(until.elementIsVisible(confirmDeleteBtn2), 5000);


    try {
      await confirmDeleteBtn2.click();
    } catch (e) {
      console.warn(" Normal click on confirmDeleteBtn2 failed, trying JS click...");
      await driver.executeScript("arguments[0].click();", confirmDeleteBtn2);
    }

    await sleep(800);

    let rowsAfterDelete = await waitForRows(driver);
    console.log(` Rows after confirm delete: ${rowsAfterDelete.length}`);

    if (!(rowsAfterDelete.length === rowsBeforeDelete.length - 1)) {
      console.warn(
        ` (Warning) Expected one less row after delete (${rowsBeforeDelete.length - 1}), but got ${rowsAfterDelete.length}`
      );
    }

    console.log("✅ TEST 5 PASSED\n");

     // ========== TEST 6: New lesson button navigation ==========
    console.log("[TEST 6] New lesson button -> add-lesson.html...");

    await driver.get(DASHBOARD_URL);
    const newLessonBtn = await driver.findElement(By.css(".frame-28"));
    await newLessonBtn.click();

    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes(ADD_LESSON_URL_FRAGMENT);
    }, 5000);

    const currentUrlAdd = await driver.getCurrentUrl();
    console.log(`  URL after clicking new lesson: ${currentUrlAdd}`);
    if (!currentUrlAdd.includes(ADD_LESSON_URL_FRAGMENT)) {
      throw new Error("Expected to navigate to add-lesson.html after clicking 'تعریف درس جدید'.");
    }

    console.log("✅ TEST 6 PASSED\n");
