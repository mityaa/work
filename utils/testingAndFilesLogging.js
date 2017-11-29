const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');
const dateformat = require('dateformat');
const Logger = require('../Logger');
const Mailer = require('./MailerAsync');
const ConfigParser = require('../ConfigParser');


module.exports = class filesTesting {

    constructor(fileName, email_subj) {
        this.filePrefix = fileName;
        this.emailSubject = email_subj;
        this.mocha = new Mocha();
        this.logger = new Logger();
        this.failed = false;
        this.report = '<meta charset="UTF-8">';
    }

    static getTestFiles() {
        var prefix = this.filePrefix;
        var mocha = this.mocha;
        fs.readdirSync(__dirname).filter(function (file) {
            return file.indexOf(prefix) > -1;
        }).forEach(function (file) {
            mocha.addFile(
                path.join(__dirname, file)
            );
        });
        this.mocha.files.forEach(function (file) {
            console.log('- ' + file);
        });
    }

    runTestAndSendReport() {
        filesTesting.getTestFiles();
        var report = this.report;
        var failed = this.failed;
        var logger = this.logger;
        var subject = this.emailSubject;
        mocha.run(function (failures) {
            process.on('exit', function () {
                process.exit(failures);
            });
        })
            .on('suite', function (suite) {
                report += `<h4>${suite.title}</h4>`;
            })
            .on('pass', function (test) {
                report += `<pre>${test.title} - ok</pre>`;
            })
            .on('pending', function (test) {
                report += `<pre>${test.title} - <mark>пропущен</mark></pre>`;
            })
            .on('fail', function (test, err) {
                var error = err.toString().replace(/\[90m/g, '').replace(/\[39m/g, '');
                report += `<pre>${test.title} - <mark>fail</mark><br>${error}</pre>`;
                failed = true;
            })
            .on('end', function () {
                fs.writeFileSync(logger.todayLogsDir + path.basename(__filename).replace(path.extname(__filename), '') + `_env_` + dateformat(logger.now, "HH:MM:ss") + '.html', report);
                var email = {};
                email.receivers = ConfigParser.getProperties().AVIA.bolEmailReceivers;
                if (failed > 0) {
                    email.priority = 'high';
                    email.subject = `${subject} - ОШИБКА (${dateformat(new Date(), "dd-mm-yyyy HH:MM")})`;
                } else {
                    email.subject = `${subject} - ОК (${dateformat(new Date(), "dd-mm-yyyy HH:MM")})`;
                }
                // email.body = logger.todayLogsLink + path.basename(__filename).replace(path.extname(__filename), '') + `_env_` + dateformat(logger.now, "HH:MM:ss") + '.html';
                email.body = report;
                Mailer.send(email).then(function (info) {
                    console.log(info.response);
                }, function (err) {
                    console.log(err);
                });
            });
    }
};