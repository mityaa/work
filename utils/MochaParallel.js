const fs = require('fs');
const path = require('path');
const colors = require('colors');
const dateFormat = require('dateformat');
const child_process = require('child_process');
const Mailer = require('./MailerAsync');
module.exports = class MochaParallel {
    constructor(email) {
        this.email = email;
        this.failed = false;
    }

    run(folderPath) {
        var testLog = {};
        var tests = [];
        var ENV = process.env;
        var mochaPath = path.resolve(__dirname, '..', 'node_modules', '.bin', 'mocha');

        fs.readdirSync(folderPath).filter(function (file) {
            return file.indexOf('runner') == -1 && file.indexOf('skip') == -1;
        }).forEach(function (file) {
            tests.push(new Promise(function (resolve) {
                testLog[file] = {
                    output: '',
                    failed: false
                };
                var testfilePath = path.resolve(folderPath, file);
                console.log(`running: ${mochaPath} ${testfilePath}`);
                var job = child_process.spawn(mochaPath, [testfilePath], ENV);
                job.stdout.on('data', (data) => {
                    //console.log(colors.yellow(data.toString().replace(/\n*/g, '')));
                    testLog[file].output += data;
                });

                job.stderr.on('data', (err) => {
                    testLog[file].output += err;
                });

                job.on('close', (code) => {
                    if (code > 0) {
                        // console.log(colors.red(testLog[file].output.replace(/[\n]{2,}/g, '\n')));
                        console.log(colors.bgRed(colors.white(testLog[file].output.replace(/[\n]{2,}/g, '\n'))));
                        testLog[file].failed = true;
                        resolve(false);
                    } else {
                        console.log(colors.green(testLog[file].output.replace(/[\n]{2,}/g, '\n')));
                        testLog[file].failed = false;
                        resolve(true);
                    }
                });
            }));
        });

        Promise.all(tests).then(values => {
            var self = this;
            self.email.body = '';
            Object.keys(testLog).forEach(function (key) {
                var color = 'green';
                if (testLog[key].failed) {
                    color = 'red';
                }
                self.email.body += `<details>
                    <summary>
                        <font size="3" face="Arial" color="${color}">${key}</font>
                        <font size="1" face="Arial" color="grey"> (click to open)</font>
                    </summary>
                    <small>
                        <pre>${testLog[key].output}</pre>
                    </small>
                </details>`;
            });

            if (values.indexOf(false) > -1) {
                if (self.email.subject.indexOf('[status]') > -1) {
                    self.email.subject = self.email.subject.replace(/\[status\]/g,
                        `[ERROR]-[${dateFormat(new Date().getTime(), "dd.mm.yyyy HH:MM")}]`);
                } else {
                    self.email.subject += ' - ERROR';
                }
                self.email.priority = 'high';
            } else {
                if (self.email.subject.indexOf('[status]') > -1) {
                    self.email.subject = self.email.subject.replace(/\[status\]/g,
                        `[ОК]-[${dateFormat(new Date().getTime(), "dd.mm.yyyy HH:MM")}]`);
                } else {
                    self.email.subject += ' - ОК';
                }
            }
            Mailer.send(self.email).then((msg) => {
                console.log(colors.dim(msg.response));
                if (values.indexOf(false) > -1) {
                    process.on('exit', function () { throw new Error('Test suite FAILED!'); });
                }
            });
        }, reason => {
            throw new Error(reason);
        });
    }
};