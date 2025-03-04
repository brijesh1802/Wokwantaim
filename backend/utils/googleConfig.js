const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Candidate = require('../models/candidate.model');  
const CandidateProfile = require('../models/candidate.profile.model');
const sendEmail = require('./emailService');
const { uploadToCloudinary } = require('../middleware/upload');
const axios = require('axios'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,  
}, async (accessToken, refreshToken, profile, done) => {
    try {

        let candidate = await Candidate.findOne({ email: profile.emails[0].value });

        const profilePhotoURL = profile.photos[0].value;

        const response = await axios.get(profilePhotoURL, { responseType: 'arraybuffer' });

        const profilePhotoBuffer = Buffer.from(response.data, 'binary');

        const profilePhotoUpload = await uploadToCloudinary(profilePhotoBuffer, 'uploads/profilePhotos', 'image');

        if (!candidate) {
            candidate = new Candidate({
                fullName: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                },
                email: profile.emails[0].value,
                password: '', 
                experienceLevel: 'Entry-Level',
                jobType: 'Full-time',
                phoneNumber:'',
                profilePhoto: profilePhotoUpload.url,
                resume:'',
                gender: profile.gender, 
                modeofLogin: 'google', 
                isVerified: true,  
            });

            const newCandidate = await candidate.save();
            const newProfile = new CandidateProfile({ candidateId: newCandidate._id });
            await newProfile.save()
        }

        const dashboardURL = `${process.env.VERCEL_URL}`;

        const subject = "🎉 Welcome to Wokwantaim - Your Journey Begins Now!";

const body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Wokwantaim</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Poppins', sans-serif; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" bgcolor="#ff9900" style="padding: 40px 0; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to Wokwantaim 🎉</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                We're thrilled to have you on board! 🚀 Wokwantaim is all about connecting people and creating opportunities. Here's how you can get started:
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                                            ✅ <strong>Complete Your Profile</strong> – Let others know more about you.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                                            🔍 <strong>Explore Opportunities</strong> – Discover new connections and possibilities.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                                            💬 <strong>Engage with the Community</strong> – Stay updated and be part of discussions.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${dashboardURL}" style="display: inline-block; padding: 12px 24px; background-color: #ff9900; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">🚀 Get Started</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                            <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">
                                Need help? <a href="mailto:support@wokwantaim.com" style="color: #ff9900; text-decoration: none;">Contact Support</a>
                            </p>
                            <p style="color: #888; font-size: 12px; margin: 0;">
                                If you no longer wish to receive these emails, <a href="${dashboardURL}/unsubscribe" style="color: #ff9900; text-decoration: none;">Unsubscribe here</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;


        await sendEmail(profile.emails[0].value, subject, body);

        return done(null, candidate); 
    } catch (err) {
        console.error('Error during Google login:', err);
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
