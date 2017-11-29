var fs = require('fs');


/**
 * Create csv log with specified headers
 * @absolutePath {String} path to csv log file
 * @csvHeaders {Array} array of strings (csv column names) 
 * @delimiter {String} delimiter of csv file (';' is default)
 */
module.exports = class csvLogger {

    constructor(absolutePath, csvHeaders, delimiter) {
        this.absolutePath = absolutePath;
        this.csvHeaders = csvHeaders;
        this.delimiter = delimiter || ';';
        fs.appendFile(this.absolutePath, this.csvHeaders.toString().replace(/\,+/g, ';') + '\n', function (err) {
            if (err) throw err;
        });
    }

    /**
     * Add a row of values to csv log
     * @inputData {Object} object of
     */
    addRow(inputData) {
        var csvValues = '';
        var delimiter = this.delimiter;
        this.csvHeaders.forEach(function (colunm) {
            if (inputData[colunm] !== undefined) {
                csvValues += inputData[colunm] + delimiter;
            } else {
                csvValues += '-' + delimiter;
            }
        });
        fs.appendFile(this.absolutePath, csvValues + '\n', function (err) {
            if (err) throw err;
        });
    }

    /**
     * Add a row of values to csv log
     * @inputData {Object} object of
     */
    addRowSync(inputData) {
        var csvValues = '';
        var delimiter = this.delimiter;
        this.csvHeaders.forEach(function (colunm) {
            if (inputData[colunm] !== undefined) {
                csvValues += inputData[colunm] + delimiter;
            } else {
                csvValues += '-' + delimiter;
            }
        });
        try {
            fs.appendFileSync(this.absolutePath, csvValues + '\n');
        } catch (error) {
            console.log(`Can't add a row to csv file:\n${error}`);
        }
    }

    getLogPath() {
        return this.absolutePath;
    }

};