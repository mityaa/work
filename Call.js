var fs = require('fs');
var traverse = require('traverse');
var Client = require('./Client.js');

module.exports = class Call {

    constructor(call, endpoint) {
        this.callFile = call || undefined;
        this.endpoint = endpoint || undefined;
        this.method = null;
        this.headers = null;
        this.path = null;
        this.queryParameters = null;
        this.body = null;
        this.response = null;

        // get call model
        this.contents = fs.readFileSync(this.callFile, 'utf8');
        this.callModel = JSON.parse(this.contents);
    }

    setInputTestData(testData) {
        var callModel = this.callModel;
        // set path parameters with test data
        var idsInPath = callModel.path.match(/{([A-Za-z]+)}/g);
        for (var key in idsInPath) {
            var id = idsInPath[key].replace(/({|})+/g, '');
            // console.log("will replace " + idsInPath[key] + " with value '" + testData[id] + "'"); // FOR DEBUG
            callModel.path = callModel.path.replace(idsInPath[key], testData[id]);
        }

        // set body and query parameters
        var setPropsWithTestData = function (callModel, testData, jsonTestData) {
            jsonTestData = jsonTestData || undefined;
            for (var prop in callModel) {
                if (typeof callModel[prop] == 'object') {
                    if (callModel[prop].length === 0) {
                        // console.log("try to change " + prop + " from ''" + callModel[prop] + "'' to ''" + testData[prop] + "'"); // FOR DEBUG
                        callModel[prop] = testData[prop];
                    } else {
                        if (prop != 'headers' /*&& prop != 'requiredInResponse'*/) {
                            setPropsWithTestData(callModel[prop], testData);
                        }
                    }
                } else {
                    if (prop != 'method' && prop != 'path') {
                        callModel[prop] = testData[prop];
                    }
                }
            }
            if (jsonTestData !== undefined) {
                callModel.body = JSON.parse(jsonTestData);
            }
        };
        setPropsWithTestData(callModel, testData);

        // remove empty parameters from the body
        if (callModel.body !== undefined) {
            traverse(callModel.body).forEach(function (paramValue) {
                if (paramValue === undefined | paramValue == 'undefined') this.remove();
            });
        }

        // remove empty parameters from the query parameters
        if (callModel.queryParameters !== undefined) {
            traverse(callModel.queryParameters).forEach(function (paramValue) {
                if (paramValue === undefined | paramValue == 'undefined') this.remove();
            });
        }
    }

    send() {
        var client = new Client();
        client.setEndpoint(this.endpoint);
        client.setRequestData(this.callModel);
        client.send();
        this.url = client.request.url;
        this.method = client.method;
        this.response = client.response;
    };
};