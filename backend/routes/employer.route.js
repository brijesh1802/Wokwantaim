
// Logout route
// router.post('/logout', authMiddleware, (req, res) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.decode(token);
//     const expiry = decoded.exp;
//     addToBlacklist(token, expiry);
//     res.json({ msg: 'Logout successful' });
// });

const express = require('express');
const { signup, login, profile, verifyEmail } = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);  

router.get('/profile',authMiddleware, profile);

router.get("/verify/:token", verifyEmail);

module.exports = router;