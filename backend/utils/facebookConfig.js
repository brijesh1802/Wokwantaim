const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Candidate = require('../models/candidate.model');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log(profile);

        // Ensure you are checking the email field directly in the Candidate model
        let candidate = await Candidate.findOne({ email: profile.emails[0].value });

        // Split the name into first and last name
        let firstName = profile.displayName.split(' ')[0];
        let lastName = profile.displayName.split(' ')[1] || null;
        
        // Extract profile photo from the profile object
        let profilePhoto = profile.photos[0].value;

        if (!candidate) {
            // If no candidate found, create a new one
            candidate = new Candidate({
                fullName: {
                    firstName: firstName,
                    lastName: lastName
                },
                email: profile.emails[0].value,
                password: '',  // Use an empty password since you're using Facebook authentication
                profilePhoto: profilePhoto,
                gender: profile.gender, 
                isVerified: true,
                modeofLogin : 'facebook'  // You can adjust this based on your app's logic
            });

            // Save the new candidate to the database
            await candidate.save();
        }

        return done(null, candidate);  // Send the candidate as the authenticated user
    } catch (err) {
        return done(err, false);  // Pass the error to the done function if any occurs
    }
}));

// Serializing user
passport.serializeUser((user, done) => {
    done(null, user._id);  // Store the user ID to use during session
});

// Deserializing user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Candidate.findById(id);  // Find user by ID (Mongo _id)
        done(null, user);  // Return the user object
    } catch (err) {
        done(err, null);  // Pass the error to done if an error occurs
    }
});
