const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../models/employer.model');
const authMiddleware = require('../middleware/authMiddleware');
const { addToBlacklist } = require('../utils/blacklist');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { name, phone, email, password, website,joinType, } = req.body;

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
    const urlPattern = new RegExp('^(https?:\\/\\/)?(www\\.)?' + // protocol and www
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}\\.com|\\.edu|\\.org'  // domain name with .com, .edu, .org
    )

    if (!urlPattern.test(website)) {
        return res.status(400).json({ msg: 'Invalid website URL' });
    }
    

    try {
        let employer = await Employer.findOne({ email });
        if (employer) {
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

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
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
            return res.status(400).json({ msg: 'Invalid credentials' });
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

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
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
        const employer = await Employer.findById(req.user.id).select('-password');
        if (!employer) {
            return res.status(404).json({ msg: 'Employer not found' });
        }
        res.json(employer);
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