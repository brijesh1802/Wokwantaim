const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Candidate = require('../models/candidate.model');
const CandidateProfile = require('../models/candidate.profile.model');
const sendEmail = require('./emailService');
const { uploadToCloudinary } = require('../middleware/upload');
const axios = require('axios');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
}, async (accessToken, refreshToken, profile, done) => {
    try {

        let candidate = await Candidate.findOne({ email: profile.emails[0].value });

        let firstName = profile.displayName.split(' ')[0];
        let lastName = profile.displayName.split(' ')[1] || null;
        
        const profilePhotoURL = profile.photos[0].value;
        
        const response = await axios.get(profilePhotoURL, { responseType: 'arraybuffer' });
        
        const profilePhotoBuffer = Buffer.from(response.data, 'binary');
        
        const profilePhotoUpload = await uploadToCloudinary(profilePhotoBuffer, 'uploads/profilePhotos', 'image');

        if (!candidate) {
            candidate = new Candidate({
                fullName: {
                    firstName: firstName,
                    lastName: lastName
                },
                email: profile.emails[0].value,
                password: '',  
                profilePhoto: profilePhotoUpload.url,
                experienceLevel: 'Entry-Level',
                jobType: 'Full-time',
                phoneNumber:'',
                resume:'',
                gender: profile.gender, 
                isVerified: true,
                modeofLogin : 'facebook'  
            });
            const newCandidate = await candidate.save();
            const newProfile = new CandidateProfile({ candidateId: newCandidate._id });
            await newProfile.save()
        }

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
            <div>
            <p>If you no longer wish to receive these emails, <a href="${dashboardURL}/unsubscribe">Unsubscribe here</a>.</p>
            </div>
        </div>
        `;

        await sendEmail(profile.emails[0].value, subject, body);

        return done(null, candidate); 
    } catch (err) {
        return done(err, false);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user._id);  
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await Candidate.findById(id); 
        done(null, user);  
    } catch (err) {
        done(err, null);  
    }
});
