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
