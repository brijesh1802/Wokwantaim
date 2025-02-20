const express = require('express');
const { signup, login, profile, verifyEmail } = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);  

router.get('/profile',authMiddleware, profile);

router.get("/verify/:token", verifyEmail);

module.exports = router;