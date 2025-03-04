const Admin = require('../models/admin.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const signup = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 3, max: 20 })) {
        return res.status(400).json({ message: 'Username must be alphanumeric and between 3-20 characters' });
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0
    })) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUsername = await Admin.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            email,
            role
        });
        await newAdmin.save();

        return res.status(201).json({ message: 'Admin created successfully' });

    } catch (error) {
        console.error('Error in admin signup:', error);
        return res.status(500).json({ message: 'An error occurred during signup' });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d', algorithm: 'HS256' }
        );

        res.json({ message: "Login successful!", token });

    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

const profile = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const admin = await Admin.findOne({ email: userEmail });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Profile fetched successfully', admin });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

const getAll = async (req, res) => {
    try {
        const admins = await Admin.find({}, '-password');
        res.json(admins);
    } catch (error) {
        console.error('Error in getting all admins:', error);
        res.status(500).json({ message: 'An error occurred while getting all admins' });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await admin.deleteOne();
        res.json({ message: 'Admin deleted successfully' });

    } catch (error) {
        console.error('Error in deleting admin:', error);
        res.status(500).json({ message: 'An error occurred while deleting admin' });
    }
}

const editAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const { username, email, role } = req.body;

        if (username) admin.username = username;
        if (email) admin.email = email;
        if (role) admin.role = role;

        await admin.save();
        res.json({ message: 'Details edited successfully' });

    } catch (error) {
        console.error('Error in editing admin:', error);
        res.status(500).json({ message: 'An error occurred while editing admin' });
    }
}

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error in getting admin:', error);
        res.status(500).json({ message: 'An error occurred while getting admin' });
    }
}

module.exports = { signup, login, profile, getAll, deleteAdmin, editAdmin, getAdmin };
