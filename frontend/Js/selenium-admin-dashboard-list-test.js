const { Builder, By, until } = require("selenium-webdriver");

const ORIGIN = "http://127.0.0.1:5500";
const LOGIN_URL = `${ORIGIN}/pages/login.html`;
const DASHBOARD_URL = `${ORIGIN}/pages/admin-dashboard-list.html`;
const LOGIN_URL_PART = "login";


async function jsClick(driver, element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({block:'center'});",
    element
  );
  await driver.sleep(200);
  await driver.executeScript("arguments[0].click();", element);
}

(async function () {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("🔹 STEP 1: رفتن به صفحه login برای داشتن origin معتبر");
    await driver.get(LOGIN_URL);

   
    await driver.wait(until.urlContains("login"), 10000);

    console.log("🔹 STEP 2: ست کردن sabau-token در localStorage");
    await driver.executeScript(
      "window.localStorage.setItem('sabau-token','dummy-test-token');"
    );

    const token = await driver.executeScript(
      "return window.localStorage.getItem('sabau-token');"
    );
    console.log(" sabau-token =", token);

    console.log("🔹 STEP 3: رفتن به صفحه داشبورد");
    await driver.get(DASHBOARD_URL);

 
    await driver.wait(
      until.elementLocated(By.css(".datatable .tbody")),
      10000
    );

  
    await driver.wait(async (d) => {
      const rows = await d.findElements(By.css(".datatable .tbody .tr2"));
      return rows.length > 0;
    }, 10000);

    let rows = await driver.findElements(By.css(".datatable .tbody .tr2"));
    console.log(" ✅ Dashboard loaded, rows =", rows.length);

   
    const firstLessonNameEl = await driver.findElement(
      By.css(".datatable .tbody .tr2 .td2:last-child ._1")
    );
    const firstLessonName = await firstLessonNameEl.getText();
    console.log(" First lesson name:", firstLessonName);

 
    console.log("🔹 STEP 4: تست سرچ در جدول");

 
    await driver.wait(
      until.elementLocated(By.css(".dashboard-search-input")),
      10000
    );
    const searchInput = await driver.findElement(
      By.css(".dashboard-search-input")
    );

   
    await searchInput.clear();
    await searchInput.sendKeys(firstLessonName);
    await driver.sleep(700);

    rows = await driver.findElements(By.css(".datatable .tbody .tr2"));
    console.log(" Rows after positive search:", rows.length);

 
    await searchInput.clear();
    await searchInput.sendKeys("درس-خیالی-که-وجود-ندارد-123456");
    await driver.sleep(700);

    const errorOverlay = await driver.wait(
      until.elementLocated(By.css(".global-error-overlay")),
      5000
    );
    await driver.wait(until.elementIsVisible(errorOverlay), 5000);

    const errorMsg = await driver
      .findElement(By.css(".global-error-message"))
      .getText();
    console.log(" Global error message:", errorMsg);

  
    const okBtn = await driver.findElement(
      By.xpath("//button[contains(text(),'باشه')]")
    );
    await jsClick(driver, okBtn);
    await driver.sleep(300);

 
    console.log("🔹 STEP 5: تست آیکن اعلان (bell)");

    const bellWrapper = await driver.findElement(
      By.css(".badge-with-notification")
    );
    await jsClick(driver, bellWrapper);

    const notifOverlay = await driver.wait(
      until.elementLocated(By.css(".global-error-overlay")),
      5000
    );
    await driver.wait(until.elementIsVisible(notifOverlay), 5000);

    const notifMsg = await driver
      .findElement(By.css(".global-error-message"))
      .getText();
    console.log(" Notification message:", notifMsg);

    const notifOk = await driver.findElement(
      By.xpath("//button[contains(text(),'باشه')]")
    );
    await jsClick(driver, notifOk);
    await driver.sleep(300);

  
    console.log("🔹 STEP 6: تست دکمه تعریف درس جدید (.frame-28)");

    const newLessonBtn = await driver.findElement(By.css(".frame-28"));
    await jsClick(driver, newLessonBtn);

    await driver.wait(until.urlContains("add-lesson"), 10000);
    const addLessonUrl = await driver.getCurrentUrl();
    console.log(" Navigated to:", addLessonUrl);

    // برگردیم به داشبورد برای تست logout
    await driver.get(DASHBOARD_URL);
    await driver.wait(
      until.elementLocated(By.css(".datatable .tbody")),
      10000
    );

  
    console.log("🔹 STEP 7: تست logout و دیالوگ خروج");

    const logoutIcon = await driver.findElement(
      By.css(".solar-logout-outline")
    );
    await jsClick(driver, logoutIcon);

    
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'انصراف')]")),
      5000
    );

    let buttons = await driver.findElements(By.css("button"));
    let cancelBtn = null;
    let logoutBtn = null;
    for (const b of buttons) {
      const txt = await b.getText();
      if (txt.includes("انصراف")) cancelBtn = b;
      if (txt.includes("خروج")) logoutBtn = b;
    }

    await jsClick(driver, cancelBtn);
    await driver.sleep(500);

    let tokenAfterCancel = await driver.executeScript(
      "return window.localStorage.getItem('sabau-token');"
    );
    console.log(" Token after cancel:", tokenAfterCancel);

    
    await jsClick(driver, logoutIcon);
    await driver.sleep(300);

    buttons = await driver.findElements(By.css("button"));
    logoutBtn = null;
    for (const b of buttons) {
      const txt = await b.getText();
      if (txt.includes("خروج")) logoutBtn = b;
    }
    await jsClick(driver, logoutBtn);

    
    await driver.wait(until.urlContains(LOGIN_URL_PART), 10000);
    const finalUrl = await driver.getCurrentUrl();
    const finalToken = await driver.executeScript(
      "return window.localStorage.getItem('sabau-token');"
    );

    console.log(" Final URL:", finalUrl);
    console.log(" Token after logout:", finalToken);

    console.log("\n All tests passed");

  } catch (err) {
    console.error("\n TEST FAILED:", err.message);
  } finally {
    await driver.quit();
  }
})();
