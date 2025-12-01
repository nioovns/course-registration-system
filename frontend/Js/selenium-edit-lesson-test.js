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
   
    console.log("\n=== TEST 1: Load page & read initial data ===");

    await driver.get("http://127.0.0.1:5500/Pages/edit-lesson.html");
    await driver.sleep(800);

    const nameBefore = await readText(driver, "._1");
    const codeBefore = await readText(driver, "._493284");

    if (nameBefore && codeBefore)
      console.log("✅ PASS: Page loaded & initial text found");
    else
      console.log("❌ FAIL: Missing prefill text");



    console.log("\n=== TEST 2: Edit name field safely (DIV input) ===");

    await setDivText(driver, "._1", "درس ویرایش‌ شده تستی");

    const editedName = await readText(driver, "._1");

    if (editedName.includes("ویرایش"))
      console.log("✅ PASS: Name edited successfully");
    else
      console.log("❌ FAIL: Name NOT updated");


    console.log("\n=== TEST 3: Set units to 3 and check gp3/gp4 visibility ===");

    await setDivText(driver, "._3", "3");
    await driver.sleep(400);

    const gp3 = await driver.findElement(By.css(".gp3")).isDisplayed().catch(() => false);
    const gp4 = await driver.findElement(By.css(".gp4")).isDisplayed().catch(() => false);

    if (gp3 && gp4)
      console.log("✅ PASS: gp3/gp4 visible for units=3");
    else
      console.log("❌ FAIL: gp3/gp4 NOT visible when units=3");

    console.log("\n=== TEST 4: Cancel button ===");

    await driver.get("http://localhost:5500/Pages/edit-lesson.html");
    await driver.sleep(700);

    await forceClick(driver, ".login-submit2");
    await driver.sleep(800);

    const url = await driver.getCurrentUrl();

    if (url.includes("admin-dashboard-list"))
      console.log("✅ PASS: Cancel navigates back");
    else
      console.log("❌ FAIL: Cancel did NOT redirect");

console.log("\n=== TEST 5: Logout ===");

    await forceClick(driver, ".solar-logout-outline");
    await driver.sleep(300);

    try {
      await driver.switchTo().alert().accept();
      await driver.sleep(600);
    } catch {}

    const finalUrl = await driver.getCurrentUrl();

    if (finalUrl.includes("login"))
      console.log("✅ PASS: Logout redirect successful");
    else
      console.log("❌ FAIL: Logout redirect NOT detected");

     } catch (err) {
    console.error("❌ TEST ERROR:", err);

  } finally {
    await driver.quit();
  }
}

run();