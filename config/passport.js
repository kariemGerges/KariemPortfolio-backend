require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User')


// Google strategy for sign in
// The strategy check for the user id in mongo db if found return the user if not create a new user
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://kariemportfolio-backend.onrender.com/api/v1/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        // find the user in mongo db or create new one
        try {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }

             // create new user
            const newUser = new User({
                googleId : profile.id,
                username : profile.displayName,
                email : profile.emails[0].value,
                image : profile.photos[0].value
            });

            await newUser.save();
            return done(null, newUser);

        } catch (error) {
            return done(error, null);
        }
        })
);


// serialize and deserialize to handle session and data storage in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
