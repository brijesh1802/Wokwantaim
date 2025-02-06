const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.PORT_STATUS,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = (email, token) => {
  const resetLink = `${process.env.VERCEL_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h3>Password Reset Request</h3>
      <p>Dear User,</p>
      <p>We received a request to reset your password. Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <br><br>
      <p>If you did not request a password reset, please disregard this email. Your account will remain secure.</p>
      <p>Best regards,</p>
      <p>The Wokwantaim Team</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendPasswordResetEmail;
