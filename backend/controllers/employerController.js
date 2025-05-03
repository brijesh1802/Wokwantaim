const bcrypt = require('bcryptjs');
const Candidate = require('../models/candidate.model');
const jwt = require('jsonwebtoken');
const Employer  = require('../models/employer.model');
const crypto = require('crypto');
const sendEmail = require("../utils/emailService");

// Signup route
const signup =  async (req, res) => {
    const { name, phone, email, password, website, joinType } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (!phone) {
        return res.status(400).json({ message: 'Phone is required' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (!joinType) {
        return res.status(400).json({ message: 'Join type is required' });
    }
    if (!website) {
        return res.status(400).json({ message: 'Website is required' });
    }

    if (name.length < 4) {
        return res.status(400).json({ message: 'Name must be at least 4 characters' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone.length !== 10) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }
    if (phone.startsWith('0')) {
        return res.status(400).json({ message: 'Phone number should not start with 0' });
    }
    const phonePattern = /^[1-9]\d{9}$/;
    if (!phonePattern.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const urlPattern = new RegExp('^(https?:\\/\\/)?(www\\.)?' + // protocol and www
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}\\.com|\\.edu|\\.org'  // domain name with .com, .edu, .org
    );

    if (!urlPattern.test(website)) {
        return res.status(400).json({ message: 'Invalid website URL' });
    }
    

    try {
        let employer = await Employer.findOne({ email });
        let candidate = await Candidate.findOne({ email });
        if (employer || candidate) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(20).toString("hex");

        employer = new Employer({
            name,
            password: hashedpassword,
            phone,
            email,
            website,
            joinType,
            verificationToken,
        });

        await employer.save();

        // Send verification email
        const verificationURL = `${process.env.VERCEL_URL}/verify-email/${verificationToken}`;
        
        const dashboardURL = `${process.env.VERCEL_URL}`;
        
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
          <div>
            <p>If you no longer wish to receive these emails, <a href="${dashboardURL}/unsubscribe">Unsubscribe here</a>.</p>
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
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        let employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(400).json({ message: 'User Not found' });
        }

        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if(!employer.isVerified) {
            return res.status(400).json({ message: 'Please verify your email to login' });
        }

        const token = jwt.sign(
            { id: employer._id, email: employer.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d", algorithm: "HS256"  }
        );  
        res.json({ message: "Login successful!", token });

                
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Profile route
const profile =  async (req, res) => {
    try {
        // Get the logged-in user's ID from the JWT
        const userId = req.user.id;

        // Find the candidate by userId
        const employer = await Employer.findById(userId);

        // If candidate not found, return 404 error
        if (!employer) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(employer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params; 

        
        const user = await Employer.findOne({ verificationToken: token });

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

        const dashboardURL = `${process.env.VERCEL_URL}/login`;

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
            <div>
            <p>If you no longer wish to receive these emails, <a href="${dashboardURL}/unsubscribe">Unsubscribe here</a>.</p>
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

        //const password =  req.body.password;

        const employer = await Employer.findOne({
            email: userEmail
        });



        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        await employer.deleteOne()

        res.status(201).json({ message: "Employer deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while deleting account' });
    }
}

module.exports = { signup, login, profile, verifyEmail, deleteAccount};