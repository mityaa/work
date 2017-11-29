var fs = require('fs');
var url = require('url');
var path = require('path');
var json2csv = require('json2csv');
var dateFormat = require('dateformat');
var XmlHandler = require('./XmlHandler.js');
var ConfigParser = require('./ConfigParser.js');


module.exports = function () {
    var _self = this;
    this.now = new Date();
    this.nowTimestamp = this.now.getTime();
    var todayDirName = dateFormat(_self.now, "dd-mm-yyyy");
    logsDir();
    logsLink();
    todayLogsDir();
    todayLogsLink();
    billingLogsDir();

    function logsDir() {
        _self.logsDir = path.resolve(ConfigParser.getProperties().webdir) + path.sep;
    }

    function logsLink() {
        _self.logsLink = ConfigParser.getProperties().logs;
    }

    function todayLogsDir() {
        _self.todayDir = path.resolve(ConfigParser.getProperties().webdir, todayDirName);
        try {
            fs.accessSync(_self.todayDir);
        } catch (error) {
            fs.mkdirSync(_self.todayDir);
        }
        _self.todayLogsDir = _self.todayDir + path.sep;
    }

    function todayLogsLink() {
        var todayLink = url.resolve(ConfigParser.getProperties().logs, todayDirName);
        _self.todayLogsLink = todayLink + '/';
    }

    function billingLogsDir() {
        _self.billingLogsDir = path.resolve(ConfigParser.getProperties().webdir) + path.sep + 'billingLogs' + path.sep;
        try {
            fs.accessSync(_self.billingLogsDir);
        } catch (error) {
            fs.mkdirSync(_self.billingLogsDir);
        }
    }

    this.addToLog = function (absolutePath, content) {
        fs.appendFile(absolutePath, content, (err) => {
            if (err) throw err;
        });
    };

    this.addHeadersToCSV = function (absolutePath, csvHeaders) {
        fs.appendFile(absolutePath, csvHeaders.toString().replace(/\,+/g, ';') + '\n', function (err) {
            if (err) throw err;
        });
    };

    this.addValuesToCSV = function (absolutePath, inputData, delimiter) {
        delimiter = delimiter || ';';
        var csvValues = '';
        for (var key in inputData) {
            csvValues += inputData[key] + delimiter;
        }
        fs.appendFile(absolutePath, csvValues + '\n', function (err) {
            if (err) throw err;
        });
    };

    this.appendTodayLog = function (filename, inputData) {
        fs.appendFileSync(path.resolve(_self.todayLogsDir + filename), inputData);
        return url.resolve(_self.todayLogsLink, filename);
    };
};