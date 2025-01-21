const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Candidate = require('../models/candidate.model');
const { v2 : cloudinary } = require('cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const { addToBlacklist } = require('../utils/blacklist');

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for file handling
const storage = multer.diskStorage({});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limiting file size to 5MB
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
}).fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]);

// Uploading files to Cloudinary
const uploadToCloudinary = (filePath, folder) => {
    return cloudinary.uploader.upload(filePath, { folder: folder })
        .then(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }))
        .catch(error => {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        });
};


// SignUp route
router.post('/signup', upload, async (req, res) => {
    try {
        const { firstName, lastName, email, password, experienceLevel, jobType, phoneNumber } = req.body;

        // Validate fields
        if (!firstName || !lastName || !email || !password || !experienceLevel || !jobType || !phoneNumber) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Validate file uploads
        if (!req.files || !req.files['profilePhoto'] || !req.files['resume']) {
            return res.status(400).json({ msg: 'Profile photo and resume are required' });
        }

        const profilePhotoFile = req.files['profilePhoto'][0].path;
        const resumeFile = req.files['resume'][0].path;

        // Upload files to Cloudinary
        const profilePhotoUpload = await uploadToCloudinary(profilePhotoFile, 'uploads/profilePhotos');
        const resumeUpload = await uploadToCloudinary(resumeFile, 'uploads/resumes');

        // Check if candidate already exists
        let candidate = await Candidate.findOne({ email });
        if (candidate) {
            return res.status(400).json({ msg: 'Candidate already exists' });
        }

        // Create new candidate
        candidate = new Candidate({
            fullName: { firstName, lastName },
            email,
            password: await bcrypt.hash(password, 10), // Hash password
            experienceLevel,
            jobType,
            phoneNumber,
            profilePhoto: profilePhotoUpload.url, // Cloudinary URL
            resume: resumeUpload.url // Cloudinary URL
        });

        await candidate.save();

        // Generate JWT
        const payload = { user: { id: candidate._id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            res.json({
                token,
                candidate: {
                    id: candidate._id,
                    fullName: candidate.fullName,
                    email: candidate.email,
                    profilePhoto: candidate.profilePhoto,
                    resume: candidate.resume
                }
            });
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password' });
    }

    try {
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: candidate._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                throw err;
            }

            res.json({
                token,
                candidate: {
                    id: candidate._id,
                    fullName: candidate.fullName,
                    email: candidate.email,
                    profilePhoto: candidate.profilePhoto,
                    resume: candidate.resume
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Profile route
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.user.id).select('-password');
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.decode(token);
    const expiry = decoded.exp;
    addToBlacklist(token, expiry);
    res.json({ msg: 'Logout successful' });
});

module.exports = router;