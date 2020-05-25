const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');
const {
    isEmpty
} = require('../config/customFunctions')

module.exports = {
    //is used to go back to admin/index
    index: (req, res) => {
        res.render('admin/index');
    },

    //is used to get post information that has been stored in
    //MongoDB Database and go to admin/posts/index
    getPost: (req, res) => {
        Post.find().lean().populate('category').then(posts => {
            res.render('admin/posts/index', {
                posts: posts
            });
        });
    },

    //get and save post informations to the database
    submitPost: (req, res) => {
        //because the checkbox default value is on and false
        //we have to define it to 'true' and 'false'
        //if (allowComments == on) {commendallowed = true;}
        //else {comentallowed = false;}
        var commentallowed = req.body.allowComments ? true : false
        let filename = '';
        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, (err) => {
                if (err) {
                    throw err;
                }
            });
        }
        //create new collection called post
        const newPost = new Post({
            //matches name value in html
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentallowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });
        newPost.save().then(post => {
            console.log(post);
            //give the success message and redirect
            req.flash('success-message', 'Post Created Successfully');
            res.redirect('/admin/posts');
        });
    },

    //redirect to admin/posts/create
    createPost: (req, res) => {
        Category.find().lean().then(cats => {
            res.render('admin/posts/create', {
                category: cats
            });
        });
    },

    editPost: (req, res) => {
        const id = req.params.id;
        Post.findById(id).lean().then(post => {
            Category.find().lean().then(cats => {
                res.render('admin/posts/edit', {
                    post: post, //render as an object
                    category: cats
                });
            })

        });

    },

    //unused
    editPostSubmit: (req, res) => {
        const comentAllowed = req.body.allowComments ? true : false;
        const id = req.params.id;
        Post.findById(id).lean().then(post => {
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = req.body.allowComments;
            post.description = req.body.description;
            post.category = req.body.category;

            post.save().then(updatePost => {
                req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                res.redirect('/admin/posts');
            })

        });
    },
    submitEditPostPage: (req, res) => {
        //check if the checkbox is checked or unchecked and return a boolean value
        const commentsAllowed = !!req.body.allowComments;
        const id = req.params.id;
        //only find item in current ID
        Post.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = commentsAllowed;
                post.description = req.body.description;
                post.category = req.body.category;

                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');
                });
            });
    },

    deletePost: (req, res) => {
        //method from express.js
        Post.findByIdAndDelete(req.params.id).then(deletedPost => {
            req.flash('success-message', `The Post ${deletedPost.title} has been deleted`);
            res.redirect('/admin/posts');
        });
    },

    //all category method
    getCategories: (req, res) => {
        Category.find().lean().then(cats => {
            res.render('admin/category/index', {
                //category could be called in handlebars file
                category: cats
            });
        });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;
        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });
            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }
    },

    editCategoriesGetRoutes: async (req, res) => {
        const catId = req.params.id;
        //using async await because we're calling funtion
        //from 2 API
        const cats = await Category.find().lean();
        Category.findById(catId).lean().then(cat => {
            res.render('admin/category/edit', {
                //free to define variables => category, categories
                category: cat,
                categories: cats
            });
        });
    },

    editCategoriesPostRoutes: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).then(category => {
                category.title = newTitle;
                category.save().then(updated => {
                    res.json({
                        url: '/admin/category'
                    });
                });
            });
        }
    }
}