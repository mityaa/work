var path = require('path');
var nodemailer = require('nodemailer');
var ConfigParser = require('./ConfigParser.js');


function attach(attachmentsString) {
    var att = [];
    try {
        attachmentsString.slice(5).forEach((attPath) => {
            att.push({
                filename: path.basename(attPath),
                path: attPath
            });
        });
    } catch (error) {
        console.log(`Can't parse attachments`);
    }
    return att;
}

function Mailer(receivers, subject, body, attachmentsPaths) {
    // console.log(receivers, subject, body, attachments);
    receivers = receivers || ConfigParser.getProperties().emailReceivers.toString();
    subject = subject || '';
    body = body || '';
    var attachments = attachmentsPaths || undefined;

    this.smtpConfig = {
        host: 'mx3.avia-centr.ru',
        port: 25,
        secure: false, // use SSL,
        tls: {
            rejectUnauthorized: false
        }
    };
    var transporter = nodemailer.createTransport(this.smtpConfig);

    var mailOptions = {
        from: 'tests@avia-centr.ru', // sender address
        to: receivers, // list of receivers 
        subject: subject,
        // text: 'Hello world 🐴', // plaintext body
        html: body, // html body
    };

    if (attachments !== undefined) {
        mailOptions.attachments = attach(attachments);
    }


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

// console.log(process.argv);
Mailer(process.argv[2], process.argv[3], process.argv[4], process.argv);