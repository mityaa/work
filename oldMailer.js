var nodemailer = require('nodemailer');
var ConfigParser = require('./ConfigParser.js');


var Mailer = function (receivers) {
    this.receivers = receivers || ConfigParser.getProperties().emailReceivers.toString();

    this.smtpConfig = {
        host: 'mx3.avia-centr.ru',
        port: 25,
        secure: false, // use SSL,
        tls: {
            rejectUnauthorized: false
        }
    };
    var transporter = nodemailer.createTransport(this.smtpConfig);

    /*
     * input {subject:'',body:''}
    */
    this.send = function (email, callback) {
        // setup e-mail data with unicode symbols
        var body = email.body || '';
        var attachments = email.attachments || [];
        var mailOptions = {
            from: 'tests@avia-centr.ru', // sender address 
            to: this.receivers, // list of receivers 
            subject: email.subject,
            // text: 'Hello world 🐴', // plaintext body
            html: body, // html body
            attachments: attachments
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
            if (callback) {
                callback();
            }
        });
    };
};

module.exports = Mailer;