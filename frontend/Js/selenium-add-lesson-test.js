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
