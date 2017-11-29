var webdriver = require('selenium-webdriver');
var util = require('util');
var sleep = require('thread-sleep');

module.exports = class Harakiri {
    constructor(driver) {
        this.driver = driver;
        this.xpathes = {
            newEmailInput: ".//input[@id='inbox-name']",
            makeMailBoxBt: ".//button[@id='getinbox']",
            emailTable: ".//div[@id='mail_list']",
            href: ".//div[text()='%s']"
        };
    }

    makeMail(mail) {
        var _self = this;
        _self.driver.findElement(webdriver.By.xpath(_self.xpathes.newEmailInput))
            .then(function (input) {
                input.sendKeys(mail)
                    .then(() => {
                        _self.driver.findElement(webdriver.By.xpath(_self.xpathes.makeMailBoxBt))
                            .click()
                            .then(function () {
                                _self.driver.wait(webdriver.until.elementLocated(
                                    webdriver.By.xpath(_self.xpathes.emailTable)
                                ), 60000)
                            });
                    });
            });
    }

    waitWhenEmailSend(textUrl, delay, start) {
        start = start || 0;
        delay = delay || 60;
        let _self = this;
        let driver = this.driver;
        driver.findElement(webdriver.By.xpath(util.format(_self.xpathes.href, textUrl)))
            .then(function (element) {
                element.click();
            }, () => {
                _self.driver.navigate().refresh()
                    .then(function () {
                        start++;
                        if (new Date() - start < delay)
                            throw new Error('Че то долго письмо идет');
                        _self.waitWhenEmailSend(textUrl, delay, start);
                    });
            });

    }
}