var querystring = require('querystring');
var syncRequest = require('request');
var validUrl = require('valid-url');
var js2xmlparser = require('js2xmlparser');


module.exports = class Client {
    constructor() {
        this.request = {
            "endpoint": "",
            "headers": "",
            "method": "",
            "path": "",
            "queryParameters": {},
            "body": ""
        };

        this.response = {
            "statusCode": "",
            "headers": "",
            "body": "",
            "rawbody": "",
            "raw": ""
        };
    }

    setEndpoint(endpoint) {
        this.request.endpoint = endpoint;
    }

    setRequestData(request) {
        // this.request.url = '';
        this.request.method = request.method || undefined;
        this.request.path = request.path || undefined;
        this.request.headers = request.headers || '';
        this.request.queryParameters = request.queryParameters || {};
        this.request.body = request.body || '';
    }

    send() {
        // make a querystring
        var queryParamsString = querystring.stringify(this.request.queryParameters);

        // set the request body
        // this.request.body = querystring.stringify(this.request.body); // WTF?
        if (this.request.headers['content-type'] == 'application/json') {
            this.request.body = JSON.stringify(this.request.body);
        }

        // make a url
        this.request.url = this.request.endpoint + this.request.path + '?' + queryParamsString;

        // console.log(JSON.stringify(this.request, null, 4)); // for debug
        if (validUrl.isUri(this.request.url)){
            // send request
            var rawResponse = syncRequest(this.request.method, this.request.url, {
                // timeout: 200000,
                headers: this.request.headers,
                json: this.request.jsonbody,
                body: this.request.body
            });

            try {
                // this.response.value = new Buffer(res.getBody(), 'base64').toString('ascii'); // use it if you want an error on invalid status codes
                this.response.raw = rawResponse;
                this.response.rawbody = this.response.body = this.response.raw.body.toString();
                this.response.statusCode = this.response.raw.statusCode;
                this.response.headers = this.response.raw.headers;

            } catch (err) {
                // errorDetails += "\nresponse body: ", new Buffer(res.body, 'base64').toString('ascii');
                throw new Error("\nerror while sending the request:\n" + this.response.raw + '\n' + err);
            } finally {
                var body;
                try {
                    // delete === from response
                    body = this.response.body.replace(/([\s]?===[\s]?)+/g, '');
                    // parse response to JSON
                    this.response.json = JSON.parse(body);
                    // parse response to XML
                    this.response.xml = js2xmlparser("response", this.response.json);
                } catch (err) {
                    // if (this.response.value != undefined && this.response.value != '') {
                    // console.log("\terror while parsing the response: probably the response is html page");
                    this.response.xml = body;
                    this.response.json = body;
                    // }
                }
                rawResponse = null;
            }
        } else {
            // console.log(`BROKEN URL: ${this.request.url}`);
            throw new Error(`BROKEN URL: ${this.request.url}`);
        }
    }
};