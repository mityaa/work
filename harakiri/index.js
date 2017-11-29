const webdriver = require('selenium-webdriver');
const Mailer = require('../utils/MailerAsync');
const Harakiri = require('./harakiri');
var test = require('selenium-webdriver/testing');

var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {
    'args': ['--disable-fill-on-account-select', '--no-sandbox']
};
chromeCapabilities.set('chromeOptions', chromeOptions);
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();
var harakiri = new Harakiri(driver);

test.describe('Женя сливает', function () {
    this.timeout(90000);
    var mail = 'zhenya';

    test.it('Идем на сайт', function () {
        driver.get('https://harakirimail.com/');
    });

    test.it('Делаем мыло и переходим к ящику', function () {
        harakiri.makeMail(mail);
    });

    test.it('Отправляем письмо', function (done) {
        let email = {};
        email.receivers = mail + '@harakirimail.com';
        email.subject = 'http://pornhub4.com';
        email.body = 'что-то там';
        Mailer.send(email).then(function () { done(); });
    });

    test.it('Получаю письмо и кликаю по найденой ссылке', function () {
        harakiri.waitWhenEmailSend('http://pornhub4.com');
    });
});