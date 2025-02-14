const bcrypt = require('bcryptjs');
const Candidate = require('../models/candidate.model');
const CandidateProfile = require('../models/candidate.profile.model');
const jwt = require('jsonwebtoken');
const Employer  = require('../models/employer.model');
const crypto = require('crypto');
const { uploadToCloudinary } = require('../middleware/upload');
const sendEmail = require("../utils/emailService");

// SignUp route
const signup = async (req, res) => {
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

        const profilePhotoFile = req.files['profilePhoto'][0].buffer;
        const resumeFile = req.files['resume'][0].buffer;

        // Upload files to Cloudinary
        const profilePhotoUpload = await uploadToCloudinary(profilePhotoFile, 'uploads/profilePhotos');
        const resumeUpload = await uploadToCloudinary(resumeFile, 'uploads/resumes');

        // Check if candidate already exists
        let employer = await Employer.findOne({ email });
        let candidate = await Candidate.findOne({ email });
        if (employer || candidate) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Hash password
        const hashedpassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString("hex");

        // Create new candidate
        candidate = new Candidate({
            fullName: { firstName, lastName },
            email,
            password: hashedpassword, // Hashed password
            experienceLevel,
            jobType,
            phoneNumber,
            profilePhoto: profilePhotoUpload.url, // Cloudinary URL
            resume: resumeUpload.url, // Cloudinary URL
            verificationToken, // Store verification token
        });

        // Save the candidate to DB
        const newCandidate = await candidate.save();

        const newProfile = new CandidateProfile({ candidateId: newCandidate._id });
        await newProfile.save();

        // Send verification email
        const verificationURL = `${process.env.VERCEL_URL}/verify-email/${verificationToken}`;

        const subject = "🔐 Verify Your Email"
        const body = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome! 🎉</h2>
                <p>Click the button below to verify your email:</p>
                <a href="${verificationURL}" 
                   style="display:inline-block; padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px;">
                  ✅ Verify Email
                </a>
              </div> `
              

        await sendEmail(email, subject, body);
        

        res.status(201).json({ message: "User registered! Please verify your email." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login route
const login = async (req, res) => {
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

        if(!candidate.isVerified) {
            return res.status(400).json({ msg: 'Please verify your email to login' });
        }
        

        const token = jwt.sign(
            { email: candidate.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d", algorithm: "HS256" }
        );  
        
        res.json({ message: "Login successful!", token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Profile route
const profile = async (req, res) => {
    try {
        // Get the logged-in user's email from the JWT
        const userEmail = req.user.email;

        // Find the candidate by email
        const candidate = await Candidate.findOne({ email: userEmail });

        // If candidate not found, return 404 error
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error while fetching profile' });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;  // Token from the URL

        // Find the user by the verification token
        const user = await Candidate.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid token or token expired!" });
        }

        // Optional: Check if token has expired
        const tokenExpirationTime = user.tokenExpirationTime || Date.now() + 3600000; // Default: 1 hour
        if (Date.now() > tokenExpirationTime) {
            return res.status(400).json({ message: "Token has expired!" });
        }

        // Mark the user's email as verified
        user.isVerified = true;
        user.verificationToken = undefined;  // Clear the verification token after use
        user.tokenExpirationTime = undefined; // Clear expiration time if any
        await user.save();

        res.json({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { signup, login, profile, verifyEmail };