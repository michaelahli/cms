//using express lib
const express = require('express');
//using mongoose
const mongoose = require('mongoose');
//extract lib from express
const path = require('path');
const hbs = require('express-handlebars');

const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');

//get module URL and Port on configuration file
const {
    mongoDbUrl,
    PORT
} = require('./config/configuration')

const app = express();

const {
    globalVariables
} = require('./config/configuration');

const methodOverride = require('method-override');
const {
    selectOption
} = require('./config/customFunctions');
const fileupload = require('express-fileupload');

//Configure Mongoose to connect to MongoDB
mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true //using current URL
}).then(response => {
    console.log('MongoDB Connected Successfully'); //response if sucessfully connect
}).catch(err => {
    console.log('Database connection failed'); //response if failed to connect
});

//Configure express
//.use is to define middleware(plugin)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
//to access public directory as static(front end)
app.use(express.static(path.join(__dirname, 'public')));
//flash and session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));
//flash's globalVariables used to display a message to the Front End
app.use(flash());
// Passport Initialize
//the line should be here or it would throws error
app.use(passport.initialize());
app.use(passport.session());
app.use(globalVariables);

//file upload middleware
app.use(fileupload());

//Setup View Engine to Use Handlebars
app.engine('handlebars', hbs({
    defaultLayout: 'default',
    helpers: {
        select: selectOption
    }
})); //this engine will search through views/layout/default.handlebars
app.set('view engine', 'handlebars');

//Method Override
app.use(methodOverride('newMethod'));

//Routes (API)
const defaultRoutes = require('./routes/default/defaultRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
app.use('/admin', adminRoutes);
app.use('/', defaultRoutes);

//port where the application runs
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
});