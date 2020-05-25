module.exports = {
    mongoDbUrl: 'mongodb+srv://michaelahli:koko0410@cluster0-osdpx.mongodb.net/test?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        //to stop the loop
        next();
    }
}