const {Mailer} = require('../config')

const sendEmail = async ({ to, subject, html }) => {

    await Mailer.sendMail({
        from: process.env.GMAIL_EMAIL,
        to,
        subject,
        html
    });

    console.log(`Email sent to ${to}`);
};

module.exports = sendEmail;