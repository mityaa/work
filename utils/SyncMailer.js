var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
var ConfigParser = require('../ConfigParser');


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

function send(env) {
    var from, to;
    try {
        fs.statSync('./config.local.json');
        from = 'localtests@avia-centr.ru';
        to = ConfigParser.getProperties().emailReceiver;
    } catch (error) {
        from = 'tests@avia-centr.ru';
        to = env.email_receivers;
    }

    let priority;
    if (env.email_priority == 'high' || env.email_priority == 'normal' || env.email_priority == 'low') {
        priority = env.email_priority;
    } else {
        priority = 'normal';
    }
    let mailOptions = {
        from: from,
        to: to,
        subject: env.email_subject,
        // text: 'Hello world 🐴', // plaintext body
        html: env.email_body, // html body
        priority: priority
    };
    if (env.email_attachments != 'undefined') {
        mailOptions.attachments = parseAttachments(env.email_attachments.split(','));
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw new Error(`Can't send email\n${error}`);
        }
        console.log('Message sent: ' + info.response);
    });
}

// console.log(process.env);
send(process.env);