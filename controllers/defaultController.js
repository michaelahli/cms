const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

module.exports = {
    index: async (req, res) => {
        //access index means access views/default/index.handlebars
        const posts = await Post.find().lean();
        const categories = await Category.find().lean();
        res.render('default/index', {
            posts: posts,
            categories: categories
        });

    },
    loginGet: (req, res) => {
        //access loginGet means access views/default/login.handlebars
        res.render('default/login');
    },
    loginPost: (req, res) => {
        res.send('Congratulations you have succesfully submitted the data');
    },
    registerGet: (req, res) => {
        res.render('default/register');
    },
    registerPost: (req, res) => {
        //contain all of the errors
        let errors = [];

        //define the possibility of errors
        if (!req.body.firstName) {
            errors.push({
                message: 'First name is mandatory'
            });
        }
        if (!req.body.lastName) {
            errors.push({
                message: 'Last name is mandatory'
            });
        }
        if (!req.body.email) {
            errors.push({
                message: 'Email field is mandatory'
            });
        }
        if (!req.body.password || !req.body.passwordConfirm) {
            errors.push({
                message: 'Password field is mandatory'
            });
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({
                message: 'Passwords do not match'
            });
        }

        //if there is any error then back to registration page
        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else { //if there is no error
            User.findOne({
                email: req.body.email //check if there was same email registered already
            }).then(user => {
                if (user) { //if it's true, redirect to login page
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                } else {
                    const newUser = new User(req.body);
                    //hash the user's password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'You are now registered');
                                res.redirect('/login');
                                console.log(user);
                            });
                        });
                    });
                }
            });
        }
    },

    singlePost: (req, res) => {
        const id = req.params.id;

        Post.findById(id).lean().then(post => {
            if (!post) {
                res.status(404).json({
                    message: 'No Post Found'
                });
            } else {
                res.render('default/singlePost', {
                    post: post
                });
            }
        })
    }
};