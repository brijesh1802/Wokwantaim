const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, 
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: "⛏️ Wokwantaim Support Team ⛏️ <<brijeshpujari333@gmail.com>>",
        to: to,
        subject: subject,
        html: text,
        replyTo : "brijeshpujari333@gmail.com"
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("🚨 Email error:", error);
    }
};

module.exports = sendEmail;

