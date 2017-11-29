var path = require('path');
var sleep = require('thread-sleep');
var dateFormat = require('dateformat');
var webdriver = require('selenium-webdriver');
var ConfigParser = require('./ConfigParser.js');


module.exports = class Selenium {

    constructor(webDriver) {
        this.driver = webDriver;
    }


    scrollToElement(element, callback) {
        var driver = this.driver;
        callback = callback || undefined;
        element.getLocation().then(function (loc) {
            driver.executeScript('window.scrollTo(' + loc.x + ',' + loc.y + ');');
        });
        if (callback) {
            callback(element);
        }
    }

    scrollBeforeElement(element, callback) {
        var driver = this.driver;
        callback = callback || undefined;
        element.getLocation().then(function (loc) {
            loc.y = parseInt(loc.y) - 70;
            driver.executeScript('window.scrollTo(' + loc.x + ',' + loc.y + ');');
        });
        if (callback) {
            callback(element);
        }
    }

    scrollToElementBy(by, callback) {
        var driver = this.driver;
        callback = callback || undefined;
        driver.findElement(by)
            .then(function (subelement) {
                subelement.getLocation().then(function (loc) {
                    driver.executeScript('window.scrollTo(' + loc.x + ',' + loc.y + ');');
                });
                if (callback) {
                    callback(subelement);
                }
            });
    }

    type(element, content) {
        element.click();
        element.sendKeys(content);
    }

    typeBy(by, content) {
        this.driver.findElement(by)
            .then(function (subelement) {
                subelement.click();
                subelement.sendKeys(content);
            });
    }

    /**
     * Clear the input
     */
    clear(element, callback) {
        element.click();
        element.sendKeys(webdriver.Key.chord(webdriver.Key.CONTROL, "a"), webdriver.Key.BACK_SPACE).then(function () {
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Clear the input by
     */
    clearBy(by, callback) {
        this.driver.findElement(by)
            .then(function (subelement) {
                subelement.click();
                subelement.sendKeys(webdriver.Key.chord(webdriver.Key.CONTROL, "a"), webdriver.Key.BACK_SPACE).then(function () {
                    if (callback) {
                        callback();
                    }
                });
            });
    }

    /**
     * Clear the input and type the text into it
     */
    clearAndType(element, content) {
        element.click();
        element.clear();
        element.sendKeys(content);
    }

    /**
     * Clear the input found by ... and type the text into it
     */
    clearAndTypeBy(by, content) {
        this.driver.findElement(by)
            .then(function (subelement) {
                subelement.click();
                subelement.clear();
                subelement.sendKeys(content);
            });
    }

    /*
     * make a screenshot
     */
    screenshot(screenshotPath, callback) {
        var driver = this.driver;
        // var screenshotPath = screenshotPath || undefined
        screenshotPath = screenshotPath || path.resolve(ConfigParser.todayLogsDir() + 'screenshot_' + dateFormat(new Date(), "dd-mm-yy_HH-MM-ss") + '.png');
        driver.takeScreenshot().then(
            function (image, err) {
                if (err) console.log(err);
                require('fs').writeFile(screenshotPath, image, 'base64', function (err) {
                    if (err) console.log(err);
                });
                if (callback) {
                    callback(screenshotPath);
                }
            }
        );
    }

    calendarSwitch(conditionXpath, conditionValue, actionXpath, callback) {
        var driver = this.driver;
        var _self = this;
        driver.findElement(webdriver.By.xpath(conditionXpath)).getText()
            .then((text) => {
                // if (text.indexOf(conditionValue) > -1) {
                if (text != conditionValue) {
                    driver.findElement(webdriver.By.xpath(actionXpath))
                        .then(function (subelement) {
                            subelement.click().then(function () {
                                _self.calendarSwitch(conditionXpath, conditionValue, actionXpath, callback);
                            });
                        });
                } else {
                    callback();
                }
            });
    }

    calendarSwitchExtended(conditionXpath, conditionAttribute, conditionValue, actionXpath, callback) {
        var driver = this.driver;
        var _self = this;
        driver.findElement(webdriver.By.xpath(conditionXpath)).getAttribute(conditionAttribute)
            .then((attribute) => {
                // if (attribute.toString().indexOf(conditionValue.toString()) > -1) {
                if (attribute.toString() != conditionValue.toString()) {
                    driver.findElement(webdriver.By.xpath(actionXpath))
                        .then(function (subelement) {
                            subelement.click().then(function () {
                                _self.calendarSwitchExtended(conditionXpath, conditionAttribute, conditionValue, actionXpath, callback);
                            });
                        });
                } else {
                    if (callback !== undefined) {
                        callback();
                    }
                }
            });
    }

    highlight(element, color) {
        var driver = this.driver;
        return new Promise(function (resolve, reject) {
            color = color || 'yellow';
            driver.executeScript(`arguments[0].style.backgroundColor = "${color}"`, element).then(function () {
                resolve();
            }, function () {
                reject();
            });
        });
    }


    /**
     * Get certain attribute of element
     * @param  {object} element
     * @param  {string} attr
     * @param  {function} callback
     */
    getAttribute(element, attr, callback) {
        element.getAttribute(attr)
            .then(function (attrVal) {
                if (callback) {
                    callback(attrVal);
                }
            });
    }

    /**
     * Click on element with xpathA until element with xpathB is found
     * @param {string} xpathA - xpath of element A
     * @param {string} xpathB - xpath of element B
     */
    clickAuntilFindBbyXpath(xpathA, xpathB, callback) {
        var _self = this;
        var driver = this.driver;
        driver.findElement(webdriver.By.xpath(xpathB)).then(function (element) {
            if (callback) {
                callback(element);
            }
        }, function () {
            driver.findElement(webdriver.By.xpath(xpathA))
                .click()
                .then(function () {
                    _self.clickAuntilFindBbyXpath(xpathA, xpathB, callback);
                });

        });
    }

    /**
     * Click on element A until element B is found
     * @param {Object} xpathA - element A
     * @param {Object} xpathB - element B
     */
    clickAuntilFindB(elementA, elementB, callback) {
        var _self = this;
        var driver = this.driver;
        driver.findElement(elementB).then(function (element) {
            if (callback) {
                callback(element);
            }
        }, function () {
            driver.findElement(elementA)
                .click()
                .then(function () {
                    _self.clickAuntilFindB(elementA, elementB, callback);
                });

        });
    }

    /**
     * Send keys to element slowly (delay between each key)
     * @param  {object} element - WebDriver element
     * @param  {string} dataToEnter - data which needs to be entered
     * @param  {int} delay - delay in milliseconds (default is 1)
     */
    sendKeysSlow(element, dataToEnter, delay) {
        delay = delay || 100;
        sleep(delay);
        if (dataToEnter) {
            return new Promise(function (resolve) {
                dataToEnter.split('').forEach(function (key, index, arr) {
                    element.sendKeys(key).then(function () {
                        sleep(delay);
                        if (index == arr.length - 1) {
                            resolve();
                        }
                    }, function (err) {
                        throw new Error(err);
                    });
                });
            });
        } else {
            throw new Error('No data to enter for sendKeysSlow()');
        }
    }

};







