require('dotenv').config();
const ejs = require('ejs');
const express = require("express");
const multer = require('multer');
const path = require("path");
var routes = require('./routes/index');
const app = express();
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
require("./db/mongodb")
const Register = require("./models/register");
const contact = require("./models/contact");
const Document =  require("./models/documentSchema");

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const passport = require("passport");
require("./routes/passport")(passport);

const session = require('express-session');

const port = process.env.POT || 5000;

//
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));
//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }))

//Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static('public'));


//Routes
app.use(routes);

app.listen(port , () =>{
    console.log('Listening on http://localhost:5000');
})
