const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function clickAndType(driver, selector, text) {
  const el = await driver.findElement(By.css(selector));

 
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
  await driver.sleep(150);

  
  await driver.executeScript("arguments[0].click();", el);
  await driver.sleep(150);


  await el.sendKeys(Key.chord(Key.CONTROL, "a"), text);
  await driver.sleep(150);
}

async function openDropdownAndSelect(driver, dropdownSelector, desiredText) {
  
  const dropdown = await driver.findElement(By.css(dropdownSelector));

  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", dropdown);
  await driver.executeScript("arguments[0].click();", dropdown);
  await driver.sleep(200);

 
  const items = await driver.findElements(By.css(".dropdown-item, .option, div"));

  for (const opt of items) {
    const txt = (await opt.getText()).trim();
    if (txt === desiredText) {
      await driver.executeScript("arguments[0].click();", opt);
      await driver.sleep(150);
      return;
    }
  }

  throw new Error(`Option "${desiredText}" not found in dropdown ${dropdownSelector}`);
}
async function forceClickAndType(driver, selector, text) {
  const el = await driver.findElement(By.css(selector));

  
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
  await driver.sleep(200);

 
  await driver.executeScript("arguments[0].click();", el);
  await driver.sleep(200);

 
  await el.sendKeys(Key.chord(Key.CONTROL, "a"), text);
  await driver.sleep(200);
}


const BASE_URL = "http://127.0.0.1:5500/Pages/add-lesson.html";


const DEFAULT_TIMEOUT = 10000;

async function clearAndType(el, text) {
  await el.click();
  await el.sendKeys(Key.chord(Key.CONTROL, "a"));
  await el.sendKeys(Key.BACK_SPACE);
  if (text) {
    await el.sendKeys(text);
  }
}
async function openDropdownAndSelect(driver, wrapperSelector, desiredText) {
 
  const wrapper = await driver.findElement(By.css(wrapperSelector));

 
  await driver.executeScript(
    "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
    wrapper
  );

  await driver.wait(until.elementIsVisible(wrapper), DEFAULT_TIMEOUT);

  await driver.executeScript("arguments[0].click();", wrapper);

  const dropdown = await driver.wait(
    until.elementLocated(By.css(".lesson-dropdown")),
    DEFAULT_TIMEOUT
  );

  await driver.wait(until.elementIsVisible(dropdown), DEFAULT_TIMEOUT);

  const options = await dropdown.findElements(By.css("div"));
  let clicked = false;

  for (const opt of options) {
    const t = (await opt.getText()).trim();
    if (!desiredText || t === desiredText) {
      await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", opt);
      await driver.executeScript("arguments[0].click();", opt);
      clicked = true;
      break;
    }
  }

  if (!clicked && options.length > 0 && !desiredText) {
    
    const first = options[0];
    await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", first);
    await driver.executeScript("arguments[0].click();", first);
  } else if (!clicked && desiredText) {
    throw new Error(`Option "${desiredText}" not found in dropdown ${wrapperSelector}`);
  }

 
  await driver.sleep(200);
}
async function closeGlobalMessageIfAny(driver) {
  const overlays = await driver.findElements(By.css(".global-message-overlay"));
  if (overlays.length === 0) return;

  for (const ov of overlays) {
    if (await ov.isDisplayed()) {
      const btns = await ov.findElements(By.css("button"));
      if (btns.length > 0) {
        await btns[0].click(); 
        await driver.sleep(200);
      }
    }
  }
}

async function runTests() {
  const options = new chrome.Options();
 
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    console.log("Opening page:", BASE_URL);
    await driver.get(BASE_URL);
    await driver.manage().setTimeouts({ implicit: 3000 });

    
    console.log("\n[TEST 1] Page loads and base elements exist...");

    const saveBtn = await driver.findElement(By.css(".group-98 .login-submit"));
    const cancelBtn = await driver.findElement(By.css(".group-98 .login-submit2"));
    const nameEl = await driver.findElement(By.css(".group-65 ._1"));
    const unitsEl = await driver.findElement(By.css(".group-68 ._3"));

    const saveDisplayed = await saveBtn.isDisplayed();
    const nameText = (await nameEl.getText()).trim();
    const unitsText = (await unitsEl.getText()).trim();

    console.log(" Save button visible:", saveDisplayed);
    console.log(" Initial lesson name text:", `"${nameText}"`);
    console.log(" Initial units text:", `"${unitsText}"`);

    if (!saveDisplayed || !nameText || !unitsText) {
      throw new Error("Base UI elements are not correctly rendered.");
    }
    console.log("✅ TEST 1 PASSED");

    
    console.log("\n[TEST 2] Placeholder behavior & search field read-only...");

    const searchEl = await driver.findElement(By.css(".th4 .search"));
    const searchBefore = (await searchEl.getText()).trim();
    const contentEditable = await searchEl.getAttribute("contenteditable");
    const pointerEvents = await searchEl.getCssValue("pointer-events");

    console.log(' Search text:', `"${searchBefore}"`);
    console.log(" contenteditable:", contentEditable);
    console.log(" pointer-events:", pointerEvents);

   
    if (searchBefore !== "جستجو") {
      throw new Error('Search placeholder text should be "جستجو".');
    }
    if (contentEditable !== "false") {
      throw new Error("Search field must have contenteditable=false.");
    }
    if (pointerEvents !== "none") {
      throw new Error('Search must have "pointer-events: none" to be non-interactive.');
    }

    console.log("✅ TEST 2 PASSED");

    
    console.log("\n[TEST 3] Units dropdown shows/hides gp1..gp4 correctly...");

    const gp1Wrapper = await driver.findElement(By.css(".group-102 .gp1"));
    const gp2Wrapper = await driver.findElement(By.css(".group-102 .gp2"));
    const gp3Wrapper = await driver.findElement(By.css(".group-101 .gp3"));
    const gp4Wrapper = await driver.findElement(By.css(".group-101 .gp4"));

    
    async function getDisplay(el) {
      return await driver.executeScript(
        "return window.getComputedStyle(arguments[0]).display;",
        el
      );
    }

  
    await openDropdownAndSelect(driver, ".group-68 .frame-34", "2");
    await driver.sleep(300);

    const gp1_u2 = await getDisplay(gp1Wrapper);
    const gp2_u2 = await getDisplay(gp2Wrapper);
    const gp3_u2 = await getDisplay(gp3Wrapper);
    const gp4_u2 = await getDisplay(gp4Wrapper);

    console.log(" Under units=2 -> gp1 display:", gp1_u2);
    console.log(" Under units=2 -> gp2 display:", gp2_u2);
    console.log(" Under units=2 -> gp3 display:", gp3_u2);
    console.log(" Under units=2 -> gp4 display:", gp4_u2);

    if (
      gp1_u2 !== "none" ||
      gp2_u2 !== "none" ||
      gp3_u2 !== "none" ||
      gp4_u2 !== "none"
    ) {
      throw new Error("gp1..gp4 should have display:none when units <= 2.");
    }

   
    await openDropdownAndSelect(driver, ".group-68 .frame-34", "3");
    await driver.sleep(300);

    const gp1_u3 = await getDisplay(gp1Wrapper);
    const gp2_u3 = await getDisplay(gp2Wrapper);
    const gp3_u3 = await getDisplay(gp3Wrapper);
    const gp4_u3 = await getDisplay(gp4Wrapper);

    console.log(" Under units=3 -> gp1 display:", gp1_u3);
    console.log(" Under units=3 -> gp2 display:", gp2_u3);
    console.log(" Under units=3 -> gp3 display:", gp3_u3);
    console.log(" Under units=3 -> gp4 display:", gp4_u3);

    if (
      gp1_u3 === "none" ||
      gp2_u3 === "none" ||
      gp3_u3 === "none" ||
      gp4_u3 === "none"
    ) {
      throw new Error("gp1..gp4 should be visible (display != none) when units > 2.");
    }

    console.log("✅ TEST 3 PASSED");

     console.log("\n All add-lesson tests finished.");

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
  } finally {
    await driver.quit();
  }
}

runTests();