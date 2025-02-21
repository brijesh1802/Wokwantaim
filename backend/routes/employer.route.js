const express = require('express');
const { signup, login, profile, verifyEmail, deleteAccount } = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);  

router.get('/profile',authMiddleware, profile);

router.get("/verify/:token", verifyEmail);

router.delete("/deleteProfile",authMiddleware, deleteAccount);

module.exports = router;