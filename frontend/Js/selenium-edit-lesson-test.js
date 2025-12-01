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
async function clickAndType(driver, selector, text) {
    const el = await driver.findElement(By.css(selector));

    
    await el.click();
    await driver.sleep(100);

   
    await driver.executeScript("arguments[0].innerText = '';", el);
    await driver.sleep(80);

    
    await el.sendKeys(text);
    await driver.sleep(120);
}
async function readText(driver, selector) {
  const el = await driver.wait(until.elementLocated(By.css(selector)), 6000);
  return await el.getText();
}

async function setDivText(driver, selector, value) {
  const el = await driver.wait(until.elementLocated(By.css(selector)), 6000);
  await driver.executeScript("arguments[0].innerText = arguments[1];", el, value);
  await driver.sleep(150);
}

async function toastShown(driver) {
  try {
    await driver.wait(until.elementLocated(By.css(".toast-message")), 1500);
    return true;
  } catch {
    return false;
  }
}
async function run() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().addArguments("--start-maximized"))
    .build();

  try {
    // ---------------------------------------
    console.log("\n=== TEST 1: Load page & read initial data ===");

    await driver.get("http://127.0.0.1:5500/Pages/edit-lesson.html");
    await driver.sleep(800);

    const nameBefore = await readText(driver, "._1");
    const codeBefore = await readText(driver, "._493284");

    if (nameBefore && codeBefore)
      console.log("✅ PASS: Page loaded & initial text found");
    else
      console.log("❌ FAIL: Missing prefill text");
