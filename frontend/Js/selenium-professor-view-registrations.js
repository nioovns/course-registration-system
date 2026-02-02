const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL =
  "http://127.0.0.1:5500/Pages/professor-view-registrations.html";

const DASHBOARD_URL =
  "http://127.0.0.1:5500/Pages/professor-dashboard.html";

const LOGIN_URL =
  "http://127.0.0.1:5500/Pages/login.html";

const DEFAULT_TIMEOUT = 10000;

/* ================= HELPERS ================= */

async function scrollAndClick(driver, el) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({block:'center'});",
    el
  );
  await driver.sleep(150);
  await driver.executeScript("arguments[0].click();", el);
  await driver.sleep(200);
}

async function getRows(driver) {
  return await driver.findElements(By.css(".tbody .tr2"));
}

async function getCurrentUrl(driver) {
  return await driver.getCurrentUrl();
}

/* ================= TESTS ================= */

async function runTests() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    console.log("Preparing auth state...");

    await driver.get("about:blank");
    await driver.executeScript(`
      localStorage.setItem("sabau-token", "TEST_TOKEN");
      localStorage.setItem("selected-course-id", "1");
    `);

    console.log("Opening page:", BASE_URL);
    await driver.get(BASE_URL);
    await driver.manage().setTimeouts({ implicit: 3000 });

    /* ================= TEST 1 ================= */
    console.log("\n[TEST 1] Navigate to professor-dashboard via مشاهده دروس");

    const viewCoursesBtn = await driver.findElement(
      By.css(".sidenav-link")
    );

    await scrollAndClick(driver, viewCoursesBtn);

    await driver.wait(async () => {
      const url = await getCurrentUrl(driver);
      return url.includes("professor-dashboard");
    }, DEFAULT_TIMEOUT);

    const urlAfterNav = await getCurrentUrl(driver);
    console.log(" Current URL:", urlAfterNav);

    if (!urlAfterNav.includes("professor-dashboard")) {
      throw new Error("Navigation to professor-dashboard failed.");
    }

    console.log("✅ TEST 1 PASSED");

    /* ================= BACK ================= */
    await driver.get(BASE_URL);

    /* ================= TEST 2 ================= */
    console.log("\n[TEST 2] Delete student (trash + confirm)");

    const rowsBefore = await getRows(driver);
    console.log(" Rows before delete:", rowsBefore.length);

    if (rowsBefore.length === 0) {
      throw new Error("No student rows available for delete test.");
    }

    const trashIcon = await rowsBefore[0].findElement(
      By.css(".group-10")
    );

    await scrollAndClick(driver, trashIcon);

    const confirmBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(text(),'حذف')]")
      ),
      DEFAULT_TIMEOUT
    );

    await scrollAndClick(driver, confirmBtn);

    const successMsg = await driver.wait(
      until.elementLocated(By.css(".global-message-text")),
      DEFAULT_TIMEOUT
    );

    const msgText = (await successMsg.getText()).trim();
    console.log(" Success message:", msgText);

    if (!msgText.includes("حذف")) {
      throw new Error("Delete success message not shown.");
    }

    await driver.sleep(500);

    const rowsAfter = await getRows(driver);
    console.log(" Rows after delete:", rowsAfter.length);

    if (rowsAfter.length !== rowsBefore.length - 1) {
      throw new Error("Row count did not decrease after delete.");
    }

    console.log("✅ TEST 2 PASSED");

    /* ================= TEST 3 ================= */
    console.log("\n[TEST 3] Logout flow");

    const logoutIcon = await driver.findElement(
      By.css(".solar-logout-outline")
    );

    await scrollAndClick(driver, logoutIcon);

    const logoutConfirmBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(text(),'خروج')]")
      ),
      DEFAULT_TIMEOUT
    );

    await scrollAndClick(driver, logoutConfirmBtn);

    await driver.wait(async () => {
      const url = await getCurrentUrl(driver);
      return url.includes("login");
    }, DEFAULT_TIMEOUT);

    const finalUrl = await getCurrentUrl(driver);
    console.log(" Redirected to:", finalUrl);

    if (!finalUrl.includes("login")) {
      throw new Error("Logout redirect failed.");
    }

    console.log("✅ TEST 3 PASSED");

    console.log("\n🎉 ALL TARGETED TESTS PASSED");

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
  } finally {
    await driver.quit();
  }
}

runTests();
