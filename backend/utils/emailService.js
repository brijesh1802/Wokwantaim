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
  const resetLink = `http://localhost:8181/api/v1/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: 'no-reply@wokwantaim.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <br><br>
      <p>If you did not request this, please ignore this email.</p>
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
