var fs = require('fs');


/**
 * Create csv log with specified headers
 * @absolutePath {String} path to csv log file
 * @csvHeaders {Array} array of strings (csv column names) 
 * @delimiter {String} delimiter of csv file (';' is default)
 */
module.exports = function (absolutePath, csvHeaders, delimiter) {
    this.absolutePath = absolutePath;
    this.csvHeaders = csvHeaders;
    this.delimiter = delimiter || ';';
    try {
        fs.appendFileSync(this.absolutePath, this.csvHeaders.toString().replace(/\,+/g, ';') + '\n');
    } catch (error) {
        console.log(`Can't add a headers row to csv file:\n${error}`);
    }

    /**
     * Add a row of values to csv log
     * @inputData {Object} object of
     */
    this.addRow = function (inputData) {
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
    };
};