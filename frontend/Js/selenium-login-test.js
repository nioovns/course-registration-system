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
async function fillBasicFields(driver, { username, password, captcha }) {
  if (username !== undefined) {
    await waitAndType(driver, By.id("username"), username);
  }
  if (password !== undefined) {
    await waitAndType(driver, By.id("password"), password);
  }
  if (captcha !== undefined) {
    await waitAndType(driver, By.id("captcha-input"), captcha);
  }
}
async function testSuccessfulLogin(driver) {
  console.log("\n[TEST 1] Successful login...");
  await driver.get(LOGIN_URL);

  const realCaptcha = await getCaptchaCode(driver);

  await fillBasicFields(driver, {
    username: "admin",
    password: "1234",
    captcha: realCaptcha,
  });

  await waitAndClick(driver, By.css(".login-submit"));

  const successBox = await driver.wait(
    until.elementLocated(By.css(".success-box")),
    DEFAULT_TIMEOUT
  );
  await driver.wait(until.elementIsVisible(successBox), DEFAULT_TIMEOUT);

  const text = await successBox.getText();
  console.log(" Success box text (for debug):", JSON.stringify(text));

  console.log(" ✅ PASS: Success box is displayed after correct login.");
}
  async function testUsernameRequired(driver) {
  console.log("\n[TEST 2] Username required...");
  await driver.get(LOGIN_URL);

  await waitAndClick(driver, By.css(".login-submit"));

  const userError = await driver.wait(
    until.elementLocated(By.css(".user-name .error-inline")),
    DEFAULT_TIMEOUT
  );
  await driver.wait(until.elementIsVisible(userError), DEFAULT_TIMEOUT);

  const text = await userError.getText();
  console.log(" Inline error text (username):", JSON.stringify(text));

  if (!text.includes("نام کاربری را وارد کنید")) {
    throw new Error(
      "Expected 'نام کاربری را وارد کنید' but got: '" + text + "'"
    );
  }

  console.log(" ✅ PASS: Username required error is correct.");
}
async function testWrongPassword(driver) {
  console.log("\n[TEST 3] Wrong password...");
  await driver.get(LOGIN_URL);

  const realCaptcha = await getCaptchaCode(driver);

  await fillBasicFields(driver, {
    username: "student",
    password: "wrong-password",
    captcha: realCaptcha,
  });

  await waitAndClick(driver, By.css(".login-submit"));

  const passError = await driver.wait(
    until.elementLocated(By.css(".pass-word .error-inline")),
    DEFAULT_TIMEOUT
  );
  await driver.wait(until.elementIsVisible(passError), DEFAULT_TIMEOUT);

  const text = await passError.getText();
  console.log(" Inline error text (password):", JSON.stringify(text));

  if (!text.includes("نام کاربری یا کلمه عبور اشتباه است")) {
    throw new Error(
      "Expected 'نام کاربری یا کلمه عبور اشتباه است' but got: '" +
        text +
        "'"
    );
  }

  console.log(" ✅ PASS: Wrong-password error is correct.");
}
async function testWrongCaptcha(driver) {
  console.log("\n[TEST 4] Wrong captcha...");
  await driver.get(LOGIN_URL);

  const realCaptcha = await getCaptchaCode(driver);

  // Build a wrong captcha (change last char)
  let wrongCaptcha =
    realCaptcha.slice(0, -1) + (realCaptcha.slice(-1) === "A" ? "B" : "A");

  await fillBasicFields(driver, {
    username: "student",
    password: "123456",
    captcha: wrongCaptcha,
  });

  await waitAndClick(driver, By.css(".login-submit"));

  const captchaError = await driver.wait(
    until.elementLocated(By.css(".capcha .error-inline")),
    DEFAULT_TIMEOUT
  );
  await driver.wait(until.elementIsVisible(captchaError), DEFAULT_TIMEOUT);

  const text = await captchaError.getText();
  console.log(" Inline error text (captcha):", JSON.stringify(text));

  if (!text.includes("کد امنیتی اشتباه است")) {
    throw new Error(
      "Expected 'کد امنیتی اشتباه است' but got: '" + text + "'"
    );
  }

  console.log(" ✅ PASS: Wrong-captcha error is correct.");
}


