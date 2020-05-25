const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const {
    isUserAuthenticated
} = require('../../config/customFunctions');

//use admin layout for everything
router.all('/*', isUserAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.route('/').get(adminController.index);
router.route('/posts').get(adminController.getPost);
//post method is to post something
router.route('/posts/create').get(adminController.createPost).post(adminController.submitPost);
//put methood is to replace something
router.route('/posts/edit/:id').get(adminController.editPost).put(adminController.submitEditPostPage);
//delete method is to delete something
router.route('/posts/delete/:id').delete(adminController.deletePost);

//admin category routes
router.route('/category').get(adminController.getCategories).post(adminController.createCategories);
router.route('/category/edit/:id').get(adminController.editCategoriesGetRoutes).post(adminController.editCategoriesPostRoutes);

module.exports = router;