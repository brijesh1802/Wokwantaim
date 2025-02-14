
// // Logout route
// router.post('/logout', authMiddleware, (req, res) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.decode(token);
//     const expiry = decoded.exp;
//     addToBlacklist(token, expiry);
//     res.json({ msg: 'Logout successful' });
// });


const express = require('express');
const { signup, login, profile, verifyEmail } = require('../controllers/candidateController');
const {upload} = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// Using upload.fields() for handling file uploads
router.post('/signup', upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), signup);

router.post('/login', login);  

router.get('/profile',authMiddleware, profile);

router.get("/verify/:token", verifyEmail);


module.exports = router;