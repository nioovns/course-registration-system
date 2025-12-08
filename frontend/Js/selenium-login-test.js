const { Builder, By, until } = require("selenium-webdriver");

(async function () {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Opening page...");
    await driver.get("http://127.0.0.1:5500/pages/login.html");

    
    await driver.wait(until.elementLocated(By.id("username")), 10000);

    const username = await driver.findElement(By.id("username"));
    const password = await driver.findElement(By.id("password"));
    const captchaInput = await driver.findElement(By.id("captcha-input"));
    const captchaCode = await driver.findElement(By.id("captcha-code"));
    const loginBtn = await driver.findElement(By.css(".login-submit"));

    console.log("Typing username...");
    await username.sendKeys("test_user");

    console.log("Typing password...");
    await password.sendKeys("wrongpass");

    const captchaText = await captchaCode.getText();
    console.log("Captcha:", captchaText);
    await captchaInput.sendKeys(captchaText);

    console.log("Submitting...");
    await loginBtn.click();

    console.log("✅ Test executed without crash");

  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    await driver.quit();
  }
})();