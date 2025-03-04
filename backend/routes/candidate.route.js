const express = require('express');
const { signup, login, profile, verifyEmail, deleteAccount, update, getAll, getOne } = require('../controllers/candidateController');
const { upload } = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Using upload.fields() for handling file uploads
router.post('/signup', upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), signup);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.patch('/update', authMiddleware, upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), update);
router.get("/verify/:token", verifyEmail);
router.delete("/deleteProfile", authMiddleware, deleteAccount);
router.get("/getAll", authMiddleware, getAll);
router.get("/get/:id", authMiddleware, getOne);

module.exports = router;
