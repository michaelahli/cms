//use express
const express = require('express');
//use router built-in function
const router = express.Router();
//use default route for everything
const defaultController = require('./../../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../../models/UserModel');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';
    next();
});

//the route('/') will define the link for the web link
router.route('/').get(defaultController.index);

//defining local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        email: email
    }).then(user => {
        //if there is no email matched
        if (!user) {
            return done(null, false, req.flash('error-message', 'User not found with this email.'));
        }
        //use bcrypt to unhash the password
        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            //error handling
            if (err) {
                return err;
            }
            //if the password isn't matched
            if (!passwordMatched) {
                return done(null, false, req.flash('error-message', 'Invalid Username or Password'));
            }
            //else
            return done(null, user, req.flash('success-message', 'Login Successful'));
        });

    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//the '/login' is the action to do in handlebars. 
//The .post is the method to do in handlebars
//both defined in the <form actions="" method=""> in handlebars 
router.route('/login').get(defaultController.loginGet).post(passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
    session: true
}), defaultController.loginPost);
router.route('/register').get(defaultController.registerGet).post(defaultController.registerPost);

//single post route
router.route('/post/:id').get(defaultController.singlePost);
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success-message', 'Logout was successful');
    res.redirect('/');
});
//for running this code outside this script
module.exports = router;