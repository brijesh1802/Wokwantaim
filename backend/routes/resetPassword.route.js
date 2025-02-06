const express = require('express')
const crypto = require('crypto');
const sendPasswordResetEmail = require('../utils/emailService');
const candidate = require('../models/candidate.model');
const employer = require('../models/employer.model'); 
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  let user;

  try {

    user = await candidate.findOne({ email }) || await employer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentTime = Date.now();
    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = currentTime + 3600000;

    user.resetToken = token;
    user.resetTokenExpiry = resetTokenExpiry;

    await user.save();

    await sendPasswordResetEmail(email, token);

    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  let user;

  
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  if (!passwordPattern.test(newPassword)) {
    return res.status(400).json({ message: 'Password does not meet the required criteria.' });
  }

  try {

    user = await employer.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    }) || await candidate.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(404).json({ message: 'Link Expired' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the old password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;