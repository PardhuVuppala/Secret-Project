'use strict';
const nodemailer = require('nodemailer');

function sendmail(receiveremailid, subjectline, emailbody) {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com', 
            port: 465, 
            secure: true, 
            auth: {
                user: 'pardhuvuppala890', 
                pass: 'qjscfvdybdfhfcev'
            }
        });

        let mailOptions = {
            from: 'Secret Files Website',
            to: receiveremailid, 
            subject: subjectline,
            text: emailbody
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    });

}

module.exports.sendmail = sendmail;