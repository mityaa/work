var colors = require('colors');
var figlet = require('figlet');
var Table = require('cli-table2');
var urldecode = require('urldecode');
const wrapAnsi = require('wrap-ansi');
var ApiCall = require('./ApiCall.js');
var Assertions = require('./Assertions.js');


module.exports = class Case {
    constructor(test_case) {
        var _self = this;
        this.testCase = test_case;
        this.failed = false;
        this.apicall = new ApiCall(this.testCase);
        this.apicall.send();
        this.result = this.apicall.response;
        this.requestUrl = this.apicall.url;
        this.assertions = new Assertions(this.apicall.response, this.testCase.expected);

        _self.requestLog = {};
        _self.requestLog.url = urldecode(_self.apicall.url);
        if (_self.apicall.method != 'GET' && _self.apicall.method !== null && _self.apicall.method !== undefined) {
            _self.requestLog.body = JSON.stringify(_self.apicall.body, null, 4);
        }
        _self.requestLog.response = JSON.stringify(_self.apicall.response.json, null, 4);
        if (_self.assertions.failReasons.length > 0) {
            _self.requestLog.fails = [];
            _self.assertions.failReasons.forEach(function (reason) {
                _self.requestLog.fails.push(reason);
            });
        }
    }

    // NOT RECOMMENDED FOR USING
    failOnErrorsOld() {
        var assertions = this.assertions;
        var apicall = this.apicall;
        if (assertions.failReasons.length > 0) {
            this.failed = true;
            var tableSize = [16, 124];
            var width = process.stdout.columns;
            if (width !== undefined) {
                tableSize = [16, width - 21];
            }
            var table = new Table({
                colWidths: tableSize,
                wordWrap: true
            });
            var reasons = '';
            assertions.failReasons.forEach(function (reason) {
                reasons = reasons + reason + "\n";
            });
            table.push(
                { 'Fail reasons': reasons.trim() },
                { 'URL': wrapAnsi(urldecode(apicall.url), width - 25, { hard: true }) }
            );
            if (apicall.method != 'GET' && apicall.method !== null && apicall.body !== null) {
                table.push(
                    { 'Request body': JSON.stringify(apicall.body, null, 4) }
                );
            }
            var tableResponse = '';
            if (JSON.stringify(apicall.response.json, null, 4).length > 2000) {
                tableResponse = JSON.stringify(apicall.response.json, null, 4).substring(0, 2000) + '\n...';
            } else {
                tableResponse = JSON.stringify(apicall.response.json, null, 4);
            }
            table.push(
                { 'Response': tableResponse }
            );
            throw new Error('\n' + table.toString());
        }
    }

    failOnErrors() {
        if (this.assertions.failReasons.length > 0) {
            this.failed = true;
            throw new Error(this.getColoredLog());
        }
    }

    failOnErrorsPromised() {
        var _self = this;
        return new Promise(function (resolve, reject) {
            if (_self.assertions.failReasons.length > 0) {
                _self.failed = true;
                reject(this.getColoredLog());
            } else {
                resolve();
            }
        });
    }

    log(size) {
        console.log(this.getColoredLog().substr(0, size || undefined));
    }

    getColoredLog() {
        var report = '\n' + colors.yellow('Request url:\n') + this.requestLog.url + '\n';
        if (this.assertions.failReasons.length > 0) {
            report += figlet.textSync("ERROR") + '\n';
            report += colors.yellow('Fail reasons:');
            this.assertions.failReasons.forEach(function (fail) {
                report += '\n' + colors.red(fail);
            });
        }
        if (this.apicall.method != 'GET' && this.apicall.method !== null && this.apicall.method !== undefined) {
            report += colors.yellow('Request body:\n') + JSON.stringify(this.requestLog.body, null, 4) + '\n';
        }
        report += '\n' + colors.yellow('Response:\n') + this.requestLog.response;
        return report;
    }

    getLog() {
        var report = '\n' + 'Request url:\n' + this.requestLog.url + '\n';
        if (this.assertions.failReasons.length > 0) {
            report += 'Fail reasons:';
            this.assertions.failReasons.forEach(function (fail) {
                report += '\n' + fail;
            });
        }
        if (this.apicall.method != 'GET' && this.apicall.method !== null && this.apicall.method !== undefined) {
            report += 'Request body:\n' + JSON.stringify(this.requestLog.body, null, 4) + '\n';
        }
        report += '\n' + 'Response:\n' + this.requestLog.response;
        return report;
    }
};