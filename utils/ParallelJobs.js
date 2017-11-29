const fs = require('fs');
const path = require('path');
const child_process = require('child_process');


var ENV = process.env;
var forks = [];
var mochaPath = path.resolve(__dirname, '..', 'node_modules', '.bin', 'mocha');

fs.readdirSync(__dirname).filter(function (file) {
    return file; //.indexOf('bus_') > -1 && file != path.basename(__filename) && file.indexOf('confirm') < 0 && file.indexOf('mk') < 0;
}).forEach(function (file) {
    return new Promise(function (resolve, reject) {
        var testfilePath = path.resolve(__dirname, file);
        var frk = child_process.fork(mochaPath, [testfilePath], ENV);
        frk.on('close', function () {
            resolve(true);
        });
        frk.on('error', function () {
            // console.log('error: ' + err);
            reject(false);
        });
    });
});

Promise.all(forks)
    .then(values => {
        resolve(values);
    })
    .catch(function () {
        reject('errr!');
    });