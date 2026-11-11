const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Ya koi aur SMTP service
        auth: {
            user: process.env.EMAIL_USER, // Aapki email
            pass: process.env.EMAIL_PASS  // App password
        }
    });

    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;