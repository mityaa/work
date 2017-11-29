const fs = require('fs');
const path = require('path');
const colors = require('../utils/consoleColors');
const nodemailer = require('nodemailer');
const ConfigParser = require('../ConfigParser');

module.exports = class Mailer {

    /**
     * Статический метод для отправки писем
     * @param {Object} email 
     */
    static send(email) {
        return new Promise(function (resolve, reject) {
            var receivers = email.receivers.toString() || ConfigParser.getProperties().emailReceiver;
            var subject = email.subject;
            var body = email.body || '';
            var priority = email.priority || 'normal';
            var text = email.text || '';

            Object.keys(colors).forEach(function (key) {
                body = body.split(colors[key]).join("");
                // body = body.split(colors[key]).join(`<font color="${key}">`);
            });
            body = body.replace(/\[\d+m/g, '');
            // body = body.replace(/\[\d+m/g, '</font>');

            var smtpConfig = {
                host: 'mx3.avia-centr.ru',
                port: 25,
                secure: false, // use SSL,
                tls: {
                    rejectUnauthorized: false
                }
            };
            var transporter = nodemailer.createTransport(smtpConfig);

            /**
            * Parse attachments
            * @param  {Object} attachmentsArray - array of paths
            */
            function parseAttachments(attachmentsArray) {
                let att = [];
                try {
                    attachmentsArray.forEach((attPath) => {
                        try {
                            fs.accessSync(attPath);
                            att.push({
                                filename: path.basename(attPath),
                                path: attPath
                            });
                        } catch (error) {

                        }
                    });
                } catch (error) {
                    throw new Error(`Can't parse attachments\n${error}`);
                }
                return att;
            }

            var from, to;
            try {
                fs.statSync('./config.local.json');
                from = 'localtests@avia-centr.ru';
                to = ConfigParser.getProperties().emailReceiver;
            } catch (error) {
                from = 'tests@avia-centr.ru';
                to = receivers;
            }

            if (priority == 'high' || priority == 'normal' || priority == 'low') {
                priority = priority;
            } else {
                priority = 'normal';
            }

            var mailOptions = {
                from: from,
                to: to,
                subject: subject,
                text: text, // plaintext body
                html: body, // html body
                priority: priority
            };
            if (email.attachments !== undefined) {
                mailOptions.attachments = parseAttachments(email.attachments);
            }

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                // console.log(mailOptions); // temporary debug information
                if (error) {
                    // throw new Error(`Can't send email\n${error}`);
                    reject(`Can't send email\n${error}`);
                }
                resolve(info);
            });
        });
    }

    /**
     * Статический метод для формата темы письма
     * @param {Object} data - nameProject: имя проекта, 
     * branch: ветка, date: дата, typeScenario: тип сценария (+ / -)
     * testDescription: описания теста
     */
    static formatSubject(data) {
        var status;
        switch (data.status) {
            case true:
                status = 'ERROR';
                break;
            case false:
                status = 'OK';
                break;
            case undefined:
                status = 'WARNING';
                break;
        }
        return `[${data.nameProject} : ${data.branch}]-[${status}]-[${data.date}] [${data.typeScenario}] ${data.testDescription}`;
    }

    /**
     * Статический метод для формата тела письма (при ошибке)
     * @param {Object} formatDataError 
     */
    static formatBodyErrorStep(formatDataError) {
        return `Ошибка на шаге: 
        ${formatDataError.failedStep} (${formatDataError.currentFailUrl})<br>
        <i>${formatDataError.failReason}</i><br>
        <i>${formatDataError.failStack}</i>`;
    }

    static formatBodySuccessStep(formatDataSuccess) {
        return `Тест завершен успешно для: ${formatDataSuccess.envUrl}<br>
        локатор: ${formatDataSuccess.locator}<br>`;
    }
};