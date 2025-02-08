const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Candidate = require('../models/candidate.model');
const Employer = require('../models/employer.model');
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

        // Validate required fields
        if (!firstName) {
            return res.status(400).json({ msg: 'First name is required' });
        }
        if (!lastName) {
            return res.status(400).json({ msg: 'Last name is required' });
        }
        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ msg: 'Password is required' });
        }
        if (!experienceLevel) {
            return res.status(400).json({ msg: 'Experience level is required' });
        }
        if (!jobType) {
            return res.status(400).json({ msg: 'Job type is required' });
        }
        if (!phoneNumber) {
            return res.status(400).json({ msg: 'Phone number is required' });
        }

        if (firstName.length < 4) {
            return res.status(400).json({ msg: 'First name must be at least 4 characters' });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/;
        if (!emailPattern.test(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
        }

        if (phoneNumber.length !== 10) {
            return res.status(400).json({ msg: 'Phone number must be exactly 10 digits' });
        }
        if (phoneNumber.startsWith('0')) {
            return res.status(400).json({ msg: 'Phone number should not start with 0' });
        }
        const phonePattern = /^[1-9]\d{9}$/;
        if (!phonePattern.test(phoneNumber)) {
            return res.status(400).json({ msg: 'Invalid phone number format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters' });
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
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
        let employer = await Employer.findOne({ email });
        let candidate = await Candidate.findOne({ email });
        if (employer || candidate) {
            return res.status(400).json({ msg: 'Email already exists' });
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
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/;
        if (!emailPattern.test(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
        }


    try {
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ msg: 'User not found' });
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

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
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
        // Get the logged-in user's ID from the JWT
        const userId = req.user.id;

        // Find the candidate by userId
        const candidate = await Candidate.findById(userId);

        // If candidate not found, return 404 error
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error while updating profile' });
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