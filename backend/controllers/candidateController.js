const bcrypt = require('bcryptjs');
const Candidate = require('../models/candidate.model');
const CandidateProfile = require('../models/candidate.profile.model');
const jwt = require('jsonwebtoken');
const Employer  = require('../models/employer.model');
const crypto = require('crypto');
const { uploadToCloudinary } = require('../middleware/upload');
const sendEmail = require("../utils/emailService");
const { v2: cloudinary } = require('cloudinary');

// SignUp route
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, experienceLevel, jobType, phoneNumber } = req.body;

       
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
        
        if (!req.files || !req.files['profilePhoto'] || !req.files['resume']) {
            return res.status(400).json({ msg: 'Profile photo and resume are required' });
        }

        const profilePhotoFile = req.files['profilePhoto'][0].buffer;
        const resumeFile = req.files['resume'][0].buffer;

    
        const profilePhotoUpload = await uploadToCloudinary(profilePhotoFile, 'uploads/profilePhotos','image');
        const resumeUpload = await uploadToCloudinary(resumeFile, 'uploads/resumes','pdf');

      
        let employer = await Employer.findOne({ email });
        let candidate = await Candidate.findOne({ email });
        if (employer || candidate) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        
        const hashedpassword = await bcrypt.hash(password, 10);

        
        const verificationToken = crypto.randomBytes(20).toString("hex");

        
        candidate = new Candidate({
            fullName: { firstName, lastName },
            email,
            password: hashedpassword,
            experienceLevel,
            jobType,
            phoneNumber,
            profilePhoto: profilePhotoUpload.url, 
            resume: resumeUpload.url, 
            verificationToken, 
        });

        
        const newCandidate = await candidate.save();

        const newProfile = new CandidateProfile({ candidateId: newCandidate._id });
        await newProfile.save();

        
        const verificationURL = `${process.env.VERCEL_URL}/verify-email/${verificationToken}`;

        const subject = "🔐 Confirm Your Email Address"

        const body = `
        <div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Welcome to Wokwantaim 🎉</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Please confirm your email address to activate your account. Simply click the button below to verify:
            </p>
            <a href="${verificationURL}" 
            style="display: inline-block; padding: 12px 24px; margin-top: 20px; background: #007bff; color: #ffffff; 
            text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
            ✅ Verify Email
            </a>
            <p style="color: #888; font-size: 14px; margin-top: 20px;">
            If you did not sign up for this account, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #888; font-size: 12px;">
            Need help? <a href="mailto:support@wokwantaim.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
            </p>
        </div>
        </div>
        `
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
        
        const userEmail = req.user.email;

        
        const candidate = await Candidate.findOne({ email: userEmail });

        
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
        const { token } = req.params; 

        
        const user = await Candidate.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid token or token expired!" });
        }

        const email = user.email;

        
        const tokenExpirationTime = user.tokenExpirationTime || Date.now() + 3600000; // Default: 1 hour
        if (Date.now() > tokenExpirationTime) {
            return res.status(400).json({ message: "Token has expired!" });
        }

        
        user.isVerified = true;
        user.verificationToken = undefined;  
        user.tokenExpirationTime = undefined; 
        await user.save();

        res.json({ message: "Email verified successfully! You can now log in." });

        const dashboardURL = `${process.env.VERCEL_URL}/`;

        const subject = "🎉 Welcome to Wokwantaim – Let's Get Started!";


        const body = `
        <div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f4f4f4; text-align: center;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Welcome to Wokwantaim 🎉</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                We're thrilled to have you on board! Wokwantaim is all about connecting people and creating opportunities. Here’s how you can get started:
                </p>
                <ul style="text-align: left; color: #555; font-size: 16px; line-height: 1.6; margin: 20px auto; display: inline-block;">
                    <li>✅ <strong>Complete Your Profile</strong> – Let others know more about you.</li>
                    <li>🔍 <strong>Explore Opportunities</strong> – Discover new connections and possibilities.</li>
                    <li>💬 <strong>Engage with the Community</strong> – Stay updated and be part of discussions.</li>
                </ul>
                <a href="${dashboardURL}" 
                style="display: inline-block; padding: 12px 24px; margin-top: 20px; background: #007bff; color: #ffffff; 
                text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
                🚀 Get Started
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 20px;">
                If you have any questions, feel free to reach out to our support team.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #888; font-size: 12px;">
                Need help? <a href="mailto:support@wokwantaim.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
                </p>
            </div>
        </div>
        `;

        await sendEmail(email, subject, body);


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//Delete account route
const deleteAccount = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const password = req.body.password;

        const candidate = await Candidate.findOne({ email: userEmail });

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        if (candidate.modeofLogin === 'email') {
            const isMatch = await bcrypt.compare(password, candidate.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
        }

        if (candidate.profilePhoto) {
            await cloudinary.uploader.destroy(candidate.profilePhoto);
        }

        if (candidate.resume) {
            await cloudinary.uploader.destroy(candidate.resume);
        }

        await candidate.deleteOne();

        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error while deleting account' });
    }
};


module.exports = { signup, login, profile, verifyEmail, deleteAccount };