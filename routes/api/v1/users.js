const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// require('../../../models/User');
// const User = mongoose.model('User');


// route to initiate Google auth & redirect to google sign in
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


// route to handle Google auth callback and google redirect
router.get('/auth/google/callback',
    passport.authenticate('google', 
        // failure redirect to login
        { failureRedirect: 'https://kariemgerges.github.io/portfolioPage/#/ErrLandingPage' }),

    (req, res) => {
        // success redirect to blog page
        res.redirect('https://kariemgerges.github.io/portfolioPage/#/blogPage');
    });


// ROute to handle logout request and redirect to login page
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => { // Destroy the session
            if (err) {
                return next(err);
            }
            console.log('Session destroyed successfully');
            res.clearCookie('connect.sid', { path: '/' /*  */}); // Clear the session cookie
            res.redirect('https://kariemgerges.github.io/portfolioPage/#/loginPage'); // Redirect to the homepage or login page
        });
    });
});


// Router to get the current user
router.get('/current_user', (req, res) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ error: "Unauthorized: No user logged in" });
    }
});

// Router to get the current user
// router.get('/current_user', (req, res) => {
//     res.send(req.user);
//     console.log('User info:', JSON.stringify(req.user));
// });



module.exports = router