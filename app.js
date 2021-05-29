const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 1122;
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

//Passport Config
const passport = require('passport');
require('./config/passport')(passport);

// BodyParser
// app.use(express.urlencoded({ extended:false}));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// EXPRESS LAYOUT SHOULD BE ABOVE /  'VIEW ENGINE', 'EJS'
app.use(expressLayouts);

// EJS
app.set('view engine', 'ejs');

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true     
}))

// PASSPORT MIDDLEWARE
// IT'S IMPORTANT WHERE WE PUT IT
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());




// Custom Middleware
// Global Variables

// I REPEAT
// THIS CODE IS FOR PARTIALS/MESSAGES.EJS FILE

// THIS PART OF CODE IS VERY INTERESTING
// THIS CODE IS FOR PARTIALS/MESSAGES.EJS FILE
// success_msg IS BEING USED AS A VARIABLE IN THE PARTIALS/MESSAGES.EJS FILE
// BECAUSE OF THIS PART OF CODE
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');  
  // Console it if you want to understand it's working!! 
  // console.log(res.locals);  

  res.locals.error = req.flash('error');  
  next();
});





// DB Connection
const url = require('./config/keys').MONGOURI;

mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('MongoDB connected...'))
.catch(err=>console.log(err));
// because it returns a promise




app.use('/',require('./routes/index'));


app.use('/users',require('./routes/users'));


app.listen(PORT,console.log(`SERVER IS LIVE AT PORT ${PORT}`));


