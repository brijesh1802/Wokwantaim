const nodemailer = require("nodemailer");
require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.PORT_STATUS,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
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
        from: "⛏️ Wokwantaim Support Team ⛏️ <<brijesh@wokwantaim.com>>",
        to:to,
        subject:subject,
        html:text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("🚨 Email error:", error);
    }
};

module.exports = sendEmail;
