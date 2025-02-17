const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Candidate = require('../models/candidate.model');  

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,  
}, async (accessToken, refreshToken, profile, done) => {
    try {

        let candidate = await Candidate.findOne({ email: profile.emails[0].value });

        if (!candidate) {
    
            candidate = new Candidate({
                fullName: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                },
                email: profile.emails[0].value,
                password: '', 
                profilePhoto: profile.photos[0].value,
                gender:profile.gender, 
                modeofLogin : 'google', 
                isVerified: true,  
            });

            await candidate.save();
        }

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
