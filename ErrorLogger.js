var fs = require('fs');
var path = require('path');
var url = require('url');
var colors = require('colors');
var dateFormat = require('dateformat');
const child_process = require('child_process');
var Logger = require('./Logger.js');

/*
general error handler should know about:
    + driver
    + what test was run
    + url of page with err
    + screenshot
    pagesource
    + receivers of error report
*/
module.exports = class ErrorLogger {

    constructor(webDriver, TestInfo, EmailReceivers) {
        this.driver = webDriver;
        this.testInfo = TestInfo || 'some test';
        this.emailReceivers = EmailReceivers;
        this.logger = new Logger();
    }

    handle(error, message) {
        var driver = this.driver;
        var logger = this.logger;
        var emailReceivers = this.emailReceivers;
        var testInfo = this.testInfo;
        var caller = path.basename(module.parent.filename).replace(path.extname(module.parent.filename), '');
        var pathToScreen = path.resolve(logger.todayLogsDir + `${caller}_` + dateFormat(logger.now, "HH:MM:ss") + '.png');
        var pathToPagesource = path.resolve(logger.todayLogsDir + `${caller}_` + dateFormat(logger.now, "HH:MM:ss") + '.html');
        driver.takeScreenshot().then(
            function (image, err) {
                if (!err) {
                    fs.writeFile(pathToScreen, image, 'base64', () => {
                        console.log((message + '\n' + pathToScreen).red);
                        driver.getCurrentUrl().then(function (currentUrl) {
                            driver.getPageSource().then(function (pageSource) {
                                fs.writeFile(pathToPagesource, pageSource, function () {
                                    var status = child_process.execSync(`node ./SyncMailer.js ${emailReceivers}` +
                                        ` '${testInfo} для ${url.parse(currentUrl).host} - ОШИБКА (${dateFormat(new Date(), "dd-mm-yyyy HH:MM")})'` +
                                        ` '${message} на странице ${currentUrl}<br>${error.toString().replace(/\n+/g, '<br>').replace(/\'+/g, '"')}'` +
                                        ` '${pathToScreen}'` +
                                        ` '${pathToPagesource}'`
                                    );
                                    console.log((new Buffer(status, 'base64').toString('ascii')).grey);
                                });
                            });
                        });
                        driver.quit().then(function () {
                            throw error;
                        });
                    });
                } else {
                    driver.quit().then(function () {
                        console.log((message).red);
                        driver.getCurrentUrl()
                            .then(function (currentUrl) {
                                var status = child_process.execSync(`node ./SyncMailer.js ${emailReceivers}` +
                                    ` '${testInfo} для ${url.parse(currentUrl).host} - ОШИБКА (${dateFormat(new Date(), "dd-mm-yyyy HH:MM")})'` +
                                    ` '${message} на странице ${currentUrl}<br>${error.toString().replace(/\n+/g, '<br>').replace(/\'+/g, '"')}'`
                                );
                            });
                        driver.quit().then(function () {
                            throw error;
                        });
                    });
                }
            }
        );
    }
};