const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../models/employer.model');
const Candidate = require('../models/candidate.model');
const authMiddleware = require('../middleware/authMiddleware');
const { addToBlacklist } = require('../utils/blacklist');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { name, phone, email, password, website, joinType } = req.body;

    if (!name) {
        return res.status(400).json({ msg: 'Name is required' });
    }
    if (!phone) {
        return res.status(400).json({ msg: 'Phone is required' });
    }
    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }
    if (!joinType) {
        return res.status(400).json({ msg: 'Join type is required' });
    }
    if (!website) {
        return res.status(400).json({ msg: 'Website is required' });
    }

    if (name.length < 4) {
        return res.status(400).json({ msg: 'Name must be at least 4 characters' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
    }

    if (phone.length !== 10) {
        return res.status(400).json({ msg: 'Phone number must be exactly 10 digits' });
    }
    if (phone.startsWith('0')) {
        return res.status(400).json({ msg: 'Phone number should not start with 0' });
    }
    const phonePattern = /^[1-9]\d{9}$/;
    if (!phonePattern.test(phone)) {
        return res.status(400).json({ msg: 'Invalid phone number format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const urlPattern = new RegExp('^(https?:\\/\\/)?(www\\.)?' + // protocol and www
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}\\.com|\\.edu|\\.org'  // domain name with .com, .edu, .org
    );

    if (!urlPattern.test(website)) {
        return res.status(400).json({ msg: 'Invalid website URL' });
    }
    

    try {
        let employer = await Employer.findOne({ email });
        let candidate = await Candidate.findOne({ email });
        if (employer || candidate) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        employer = new Employer({
            name,
            password,
            phone,
            email,
            website,
            joinType
        });

        const salt = await bcrypt.genSalt(10);
        employer.password = await bcrypt.hash(password, salt);

        await employer.save();

        const payload = {
            user: {
                id: employer._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                throw err;
            }

            res.json({
                token,
                employer: {
                    id: employer._id,
                    name: employer.name,
                    email: employer.email,
                    password:employer.password,
                    phone: employer.phone,
                    website: employer.website,
                    joinType:employer.joinType
                }
            });
        });
    } catch (err) {
        console.error(err.message);
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
        let employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(400).json({ msg: 'User Not found' });
        }

        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: employer._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '100h' }, (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
                throw err;
            }

            res.json({
                token,
                employer: {
                    id: employer._id,
                    name: employer.name,
                    email: employer.email,
                    address: employer.address,
                    phone: employer.phone,
                    website: employer.website
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
        const employer = await Employer.findById(userId);

        // If candidate not found, return 404 error
        if (!employer) {
            return res.status(404).json({ msg: 'Employer not found' });
        }
        res.json(employer);
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