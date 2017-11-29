var path = require('path');
var colors = require('colors');
var Table = require('cli-table2');
var urldecode = require('urldecode');
const wrapAnsi = require('wrap-ansi');
var Call = require('./Call.js');
var Logger = require('./Logger.js');
var Assertions = require('./Assertions.js');


var Case = function(testCase) {
    // console.log(testCase); // for debug
    var logger = new Logger();
    this.failed = false;
    var call = new Call(path.resolve(__dirname + path.sep + 'collections' + path.sep + testCase.collection + path.sep + testCase.call + '.json'), testCase.endpoint);
    
    call.setInputTestData(testCase.input);
    call.send();
    this.response = call.response;
    this.requestUrl = call.url;
    
    // test case should compare response with expected results ???
    var assertions = new Assertions(call.response, testCase.expected);

    if (assertions.failReasons.length > 0) {
        // FAIL
        this.failed = true;
        console.log((" \u2715 " + testCase.description).red);
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
            // { 'URL': call.url }
            { 'URL': wrapAnsi(urldecode(call.url), width - 25, {hard: true}) }
        );
        if (call.method != 'GET' && call.method !== null) {
            table.push(
                { 'Request body': JSON.stringify(call.body, null, 4) }
            );
        }
        var tableResponse = '';
        if(JSON.stringify(call.response.json, null, 4).length > 2000) {
            tableResponse = JSON.stringify(call.response.json, null, 4).substring(0, 2000) + '\n...';
        } else {
            tableResponse = JSON.stringify(call.response.json, null, 4);
        }
        table.push(
            { 'Response': tableResponse }
        );
        console.log(table.toString());

        if(process.listeners('exit').length < 1) {
            process.on('exit', function() {throw new Error("Test failed!");} ); // Make build failed
        }
    } else {
        // PASS
        console.log((" \u2713 " + testCase.description).green);
    }

    if (testCase.log !== undefined) {
        logger.addToLog(testCase.log, 'Description: ' + testCase.description + '\n');
        logger.addToLog(testCase.log, 'URL: ' + call.url + '\n');
        if (call.method != 'GET' && call.method !== null) {
            logger.addToLog(testCase.log, 'Request body: ' + JSON.stringify(call.body, null, 4) + '\n');
        }
        logger.addToLog(testCase.log, 'Response: ' + JSON.stringify(call.response.json, null, 4) + '\n');
    }
};

module.exports = Case;