'use strict';
var assert = require('assert');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var SeleniumExtend = require('./SeleniumExtend.js');


var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {
    'args': ['--disable-fill-on-account-select', '--no-sandbox']
};
chromeCapabilities.set('chromeOptions', chromeOptions);

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();
var selen = new SeleniumExtend(driver);

test.describe('Some test', function() {
    test.before(() => {
    });

    test.afterEach(function() {
        // console.log(this.currentTest);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('go to url', function() {
        driver.get('http://google.com');
        driver.getTitle().then((title) => {
            assert.equal(title, 'Google');
        });
    });
    test.it('go to url', function() {
        driver.get('http://yandex.ru');
        driver.getTitle().then((title) => {
            assert.equal(title, 'Яндекс');
        });
    });
});