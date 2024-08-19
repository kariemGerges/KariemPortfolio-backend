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
        { failureRedirect: 'https://kariemgerges.github.io/loginPage' }),

    (req, res) => {
        // success redirect to blog page
        res.redirect('https://kariemgerges.github.io/blogPage');
    });


// ROute to handle logout request and redirect to login page
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => { // Destroy the session
            if (err) {
                return next(err);
            }
            res.redirect('https://kariemgerges.github.io/loginPage'); // Redirect to the homepage or login page
        });
    });
});


// Router to get the current user
router.get('/current_user', (req, res) => {
    res.send(req.user);
});



module.exports = router