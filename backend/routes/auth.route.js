const express = require('express');
const router = express.Router();
const { resetPassword, requestPasswordReset} = require('../controllers/authController');

router.post("/reset-password/:token", resetPassword);

router.post("/forgot-password", requestPasswordReset);

module.exports = router;