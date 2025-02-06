const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: 'brijeshpujari333@gmail.com',
    pass: 'voqfxqeexbflkvrh ',
  },
});

const sendPasswordResetEmail = (email, token) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: 'no-reply@wokwantaim.com',
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
