var colors = require('colors');
var child_process = require('child_process');
var ConfigParser = require('../ConfigParser');


module.exports = class Mailer {
    static send(email) {
        // [...new Set([...a,...b,...c])]
        let receivers = email.receivers.toString() || ConfigParser.getProperties().emailReceiver,
            subject = email.subject,
            body = email.body || '',
            priority = email.priority || 'normal',
            attachments = '';
        if (email.attachments !== undefined) {
            email.attachments.forEach(function (attachment) {
                attachments += attachment + ',';
            });
            attachments = attachments.substr(0, attachments.length - 1);
        }

        var status = child_process.execSync(`email_receivers='${receivers}' email_subject='${subject}' email_body='${body.replace(/\'+/g, '"').replace(/\n/g, '<br>')}' email_attachments='${attachments}' email_priority='${priority}' node ./utils/SyncMailer.js`);
        console.log((new Buffer(status, 'base64').toString('ascii')).grey);
    }
};

