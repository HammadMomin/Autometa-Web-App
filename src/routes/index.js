require('dotenv').config();
const express = require('express')
const app = express();
const path = require("path");
const router = require('express').Router();
const multer = require('multer');
const axios = require('axios');

const fs = require('fs');
const pdfparse = require('pdf-parse');
const WordExtractor = require("word-extractor");

const Register = require("../models/register");
const Document = require('../models/documentSchema');
const contact = require("../models/contact");
const session=require('express-session')

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const auth = require("../middleware/auth");
const passport = require('passport')

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


// code for static path
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../../views'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

/////ROUTING ALL THE PAGES 

router.get("/" , (req, res) => {
  if (req.session.loggedIn) {
    // user is already logged in, redirect to home page
    res.redirect('/home');
} else {
    // user is not logged in, show login page
    res.render('home')
}
});

router.get("/login", (req, res,next) => {
  if (req.session.loggedIn) {
    // user is already logged in, redirect to home page
    res.redirect('/home');
} else {
    // user is not logged in, show login page
    res.render('login', { message: '', messageType: 'null' })
} 
});

router.get("/signup", (req, res,next) => {
  if (req.session.loggedIn) {
    // user is already logged in, redirect to home page
    res.redirect('/home');
} else {
    // user is not logged in, show login page
    res.render('signup', { message: '', messageType: 'null' })
} 
});



router.get('/home', (req, res, next) => {
  if (req.session.loggedIn) {
    // user is already logged in, redirect to home page
    res.render('welcome' ,{ message: '', messageType: 'null'})
} else {
    // user is not logged in, show login page
    res.redirect('/login')
} 
});

router.get("/contact", (req, res,next) => {
  if (req.session.loggedIn) {
    // user is already logged in, redirect to home page
    res.render('contact')
} else {
    // user is not logged in, show login page
    res.redirect('/login')
}  
});

router.get("/error-404", (req, res,next) => {
  res.render('error')
});

router.get("/thank-you", (req, res,next) => {
  res.render('thankyou')
});

router.get("/verify-email", (req,res , next) =>{
  res.render('verify-email', { message: '', messageType: 'null', email: userEmailshared_verificationcode})
});

router.get("/reset-link", (req, res, next) => {
  res.render('reset-emaillink',{message:"",messageType:'null'});
});

router.get("/reset-linksent",  (req, res, next) => {
  const respectiveEmail = userEmailshared;
  
  
    res.render('reset-linksent', {emaildata : respectiveEmail});
  
});

router.get("/summarized-output", (req, res,next) => {
  if (req.session.loggedIn) {
    // user is already logged in, redirect to home page
    
    res.render('summarized-op' ,{USERQUERY : userquery, output : summarized_variable})
} else {
    // user is not logged in, show login page
    res.redirect('/login')
}
 
});

router.get("/loading-summarized-output", (req, res,next) => {
  res.render('getting-summarized-output')
});


//*******************Global Variables********************//
let sharedData = "";
let userEmailshared = "";
let userEmailshared_verificationcode = "";
let userquery ="";
let summarized_variable = "";

//Nodemailer  Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//Sign-Up Post Method and Redirected To Login Page 

router.post('/signup', async(req, res, next) => {
  
  const {fullname,email,password } =req.body;
  const existingUser = await Register.findOne({ email:email });

  if (existingUser) {

    res.render('signup', { message: 'Email Already Exists', messageType: 'error' });
    return;
  }
  userEmailshared_verificationcode=email;
  const verificationCode = Math.floor(Math.random() * 900000) + 100000;
  const registerUser=new Register({
    fullname,
    email,
    password,
    verificationCode
})

await registerUser.save()
      .then((user) => {
      });
 
///************** Sending Verification Code ************/////////

      const mailOptions = {
        from:"Autometa Corporation",
        to: email,
        subject: 'Verification Code',
        html: `<!DOCTYPE html>
        <html>
        <head>
          <title>Verification Code</title>
          <style type="text/css">
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333333;
              background-color: #F5F5F5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 30px;
              background-color: #FFFFFF;
              box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            }
            h1, h2, h3, h4, h5, h6 {
              color: #333333;
              margin-top: 0;
              margin-bottom: 15px;
            }
            h1 {
              font-size: 36px;
            }
            h2 {
              font-size: 24px;
            }
            p {
              margin-top: 0;
              margin-bottom: 15px;
            }
            a {
              color: #007BFF;
            }
            button {
              background-color: #007BFF;
              color: #FFFFFF;
              border: none;
              border-radius: 5px;
              padding: 10px 20px;
              font-size: 16px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            button:hover {
              background-color: #0069D9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Verify Your Email</h1>
            <p>Hi, ${fullname} Thank you for signing up! Your verification code is:</p>
            <h2>${verificationCode}</h2>
            <p>Please enter this code on the verification page to complete your registration.</p>
            <p>Best regards,</p>
            <p>Autometa Corporation Pvt.Ltd</p>
            <button>Visit Our Website</button>
          </div>
        </body>
        </html>`
};
    
transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });   
        res.redirect('/verify-email');
});

// Verifying Email Post Method

router.post("/verify-email", async (req, res, next) => {
  const code = req.body.code.join(''); // concatenate the digits from the input fields
  const user = await Register.findOne({ verificationCode: code });
  if (!user) {
    res.render('verify-email', { message: 'Invalid Verification Code ', messageType: 'error',  email: userEmailshared_verificationcode})
    return;
  }
  user.is_verified = 1; //Update is_verified to 1
  await user.save();
  // res.render('verify-email', { message: 'Success ', messageType: 'success',  email: userEmailshared_verificationcode})
  res.redirect('/login');
})

// ***********************FORGET PASSWORD******************//

router.post("/reset-link", async (req, res, next) => {
try {
  
  const email = req.body.email;
  userEmailshared = email;
  const userdata = await Register.findOne({email:email});
  if (userdata) {
    if(userdata.is_verified === 0){
      res.render('verify-email', { message: 'verify your email', messageType: 'error' })
  } else{
    const rstring = randomstring.generate();
    const updatedData = await Register.updateOne({email:email}, {$set:{randomstring:rstring}})

    // mail method

    const mailOptions = {
      from:"Autometa Corporation",
      to: email,
      subject: 'Reset Your Password',
      html: "<!DOCTYPE html>" +
      "<html>" +
      "<head>" +
        "<title>Reset Your Password | Autometa Corporation</title>" +
        "<style type='text/css'>" +
         " body {" +
            "font-family: Arial, sans-serif;" +
            "font-size: 16px;" +
            "line-height: 1.5;" +
            "color: #333333;" +
            "background-color: #F5F5F5;" +
            "margin: 0;" +
            "padding: 0;" +
          "}" +
          ".container {" +
            "max-width: 600px;" +
            "margin: 0 auto;" +
            "padding: 30px;" +
            "background-color: #FFFFFF;" +
            "box-shadow: 0px 0px 10px rgba(0,0,0,0.1);" +
          "}" +
          "h1, h2, h3, h4, h5, h6 {" +
            "color: #333333;" +
            "margin-top: 0;" +
            "margin-bottom: 15px;" +
          "}" +
          "h1 {" +
            "font-size: 36px;" +
          "}" +
          "h2 {" +
            "font-size: 24px;" +
          "}" +
          "p {" +
            "margin-top: 0;" +
            "margin-bottom: 15px;" +
          "}" +
          "a {" +
            "color: #007BFF;" +
          "}" +
          ".btn {" +
            "background-color: #007BFF;" +
            "color: #FFFFFF;" +
            "border: none;" +
            "border-radius: 5px;" +
            "padding: 10px 20px;" +
            "font-size: 16px;" +
            "cursor: pointer;" +
            "text-decoration: none;" +
            "transition: background-color 0.3s ease;" +
          "}" +
          ".btn span{"+
            "color: #FFFFFF;" +
            "text-decoration: none;" +
          "}" +
          ".btn:hover {" +
            "background-color: #0069D9;" +
          "}" +
        "</style>" +
      "</head>" +
      "<body>" +
        "<div class='container'>" +
          "<h1>Reset Your Password</h1>" +
          "<p>Hi " + userdata.fullname + ",</p>" +
          "<p> We heard that you lost your password sorry about that! <br>" +
            "But don't worry!. You can use the following button to reset your password." +
          "</p>" +
          "<br>" +
          "<a class='btn' href='http://localhost:5000/reset-password?token=" + rstring + "'><span>Reset Your Password<span></a>" +
          "<br>" +
          "<br>" +
          "<p>Best Regards,</p>" +
          "<p>Autometa Corporation Pvt.Ltd</p>" +
        "</div>" +
      "</body>" +
      "</html>"
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
});
 res.redirect('/reset-linksent');
  }
}
else {
  res.render('reset-emaillink',{message:"User Email is Incorrect",messageType:'error'});
}
} catch (error) {
  console.log(error.message);
}
})


///**********************RESET PASSWORD *******************************///
//
router.get("/reset-password", async (req, res, next) => {
 
      sharedData = req.query.token;
      if(!sharedData){
        res.redirect('/error-404');
      }

      res.render('reset-password',{message:"",messageType:'null'});
});
//POST
router.post("/reset-password" , async (req,res,next) => {
  try {
    const token = sharedData
    const tokenData = await Register.findOne({randomstring:token});
    if(!tokenData){
      res.redirect('/error-404');
    }

    const password =req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if(password===confirmpassword){

    const secure_password = await bcrypt.hash(password, 10);
    const updatedData = await Register.findByIdAndUpdate({ _id:tokenData._id },{ $set: {password:secure_password}});
    const tokenNull = await Register.findByIdAndUpdate({ _id:tokenData._id },{ $set: {randomstring:""}});
    
    console.log("Password Reset Successfull ! ")

    ///////////*************SEND MAIL THAT PASSWORD IS SUCCESSFULLY RESETTED *****************************/////////////

    const mailOptions = {
      from:"Autometa Corporation",
      to: tokenData.email,
      subject: 'Password Changed Successfully',
      html: "<!DOCTYPE html>" +
      "<html>" +
      "<head>" +
        "<title>Password Changed Successfully | Autometa Corporation</title>" +
        "<style type='text/css'>" +
         " body {" +
            "font-family: Arial, sans-serif;" +
            "font-size: 16px;" +
            "line-height: 1.5;" +
            "color: #333333;" +
            "background-color: #F5F5F5;" +
            "margin: 0;" +
            "padding: 0;" +
          "}" +
          ".container {" +
            "max-width: 600px;" +
            "margin: 0 auto;" +
            "padding: 30px;" +
            "background-color: #FFFFFF;" +
            "box-shadow: 0px 0px 10px rgba(0,0,0,0.1);" +
          "}" +
          "h1, h2, h3, h4, h5, h6 {" +
            "color: #333333;" +
            "margin-top: 0;" +
            "margin-bottom: 15px;" +
          "}" +
          "h1 {" +
            "font-size: 36px;" +
          "}" +
          "h2 {" +
            "font-size: 24px;" +
          "}" +
          "p {" +
            "margin-top: 0;" +
            "margin-bottom: 15px;" +
          "}" +
          "a {" +
            "color: #007BFF;" +
          "}" +
          ".btn {" +
            "background-color: #007BFF;" +
            "color: #FFFFFF;" +
            "border: none;" +
            "border-radius: 5px;" +
            "padding: 10px 20px;" +
            "font-size: 16px;" +
            "cursor: pointer;" +
            "text-decoration: none;" +
            "transition: background-color 0.3s ease;" +
          "}" +
          ".btn span{"+
            "color: #FFFFFF;" +
            "text-decoration: none;" +
          "}" +
          ".btn:hover {" +
            "background-color: #0069D9;" +
          "}" +
        "</style>" +
      "</head>" +
      "<body>" +
        "<div class='container'>" +
          "<h1>Password Changed Successfully</h1>" +
          "<p>Dear " + tokenData.fullname + ",</p>" +
          "<p>This email is to confirm that your password has been successfully changed. <br> " +
          "If you did not change your password, <br> <br>"+ 
          "<a class='btn' href='http://localhost:5000/reset-link' > <span> Change Your Password <span></a>" +
          "<br>" +
          "<br>" +
          "<p>Best Regards,</p>" +
          "<p>Autometa Corporation Pvt.Ltd</p>" +
        "</div>" +
      "</body>" +
      "</html>"
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
});

    res.redirect('/login')
    }
    else{
      res.render('reset-password',{message:"Password and Confirm Password Does Not Match",messageType:'error'});
    }
  } catch (error) {
    console.log(error.message);
  }
})


//Login Authentication And redirect to landing page

router.post("/login", async (req, res) => {
  try{
      const email = req.body.email;
      const password = req.body.password;

      const useremail = await Register.findOne({email:email});
      const isMatch = await bcrypt.compare(password, useremail.password);
      const verified = useremail.is_verified

      if(verified){
      const token = await useremail.generateAuthToken();

      // //Adding Cookie
      // res.cookie("jwt", token, {
      //     expires:new Date(Date.now() + 3600000),
      //     httpOnly:true,
      //     //secure:true (if we only want user to access in https )
      // });

      if(isMatch){
        // set loggedIn session variable to true
        req.session.loggedIn = true;
        res.redirect('/home')
             
      }else{
        res.render('login',{message:"Invalid Login Details",messageType:'error'});
      }
    }else{
      res.redirect('/verify-email')
    }
   } 
  catch (error){
    res.render('login',{message:"Invalid Login Details",messageType:'error'});
      
  }
})


// Storing contact us form details into database
router.post("/contact", async (req, res) => {
  try{
      const contactUser=new contact({
          name: req.body.name,
          email: req.body.email,
          contact: req.body.contact,
          message: req.body.message
      })
      const contacted = await contactUser.save();
      res.redirect('thank-you');   
      
       }catch (error){
        res.redirect('error-404');
  }
})

//Logout User From the landing page and also delete the cookie

router.get("/logout", async (req, res) => {
  try{

      req.session.loggedIn=false;

      console.log("Logout Successfully")
      res.redirect('/')

  } catch(error){
      res.status(500).send(error);
  }
});


// Storing Query Fired by the User In database
router.post("/home", async (req, res) => {
  try{

       ////////////////////////////////////QUERY////////////////////////////////////////////
       const userQuery = req.body.query;
       const sharedDocument_id = shared_id;
 
       userquery=userQuery;
       shared_id = "";
 
       const updatedDocument = await Document.updateOne({_id:sharedDocument_id}, {$set:{query:userQuery}})
      //  console.log(updatedDocument)

       const document_database = await Document.findOne({ _id:sharedDocument_id });
       

       //////////////////////////////////////////////////////////////////////////////////////

  
  //Get file extension
  const extension = document_database.originalname.split('.').pop().toLowerCase();
  const filePath = path.join(__dirname, '../../Documents', document_database.filename);
 

 /////////FOR PDF FILES ////////////////
  if (extension === 'pdf') {

    const pdffile = fs.readFileSync(filePath);
    pdfparse(pdffile).then(function(data){
     
     let pdfText = '';

  pdfText = data.text;

//////////////// axios request for pdf 

      const data_model = {
        text: pdfText ,
        question: userQuery
      
      };

      // res.redirect("/loading-summarized-output")

      axios.post('http://127.0.0.1:5000/', data_model)
        .then(response => {
          
          // console.log(response.data);
          summarized_variable = response.data;

          if(summarized_variable){
            res.redirect('/summarized-output');
            }
            console.log("Summarized Output Shown at Frontend")

        })
        .catch(error => {
          console.error("Failure " + error);
        });


      })
  

  } 
  /////////FOR WORD FILES ////////////////
  else if (extension === 'docx' || extension === 'doc') {
    
    // create an instance of the WordExtractor
    const extractor = new WordExtractor();

    // use the extract method of the WordExtractor instance to extract the text from the docx file
    const extracted = extractor.extract(filePath);

    // handle the promise returned by the extract method and save the extracted text to a variable
    extracted.then(function(doc) {
      const extractedText = doc.getBody();
      // console.log(extractedText);

///////////////////// axios req for 'docx' and 'doc'

const data_model = {
  text: extractedText ,
  question: userQuery

};

axios.post('http://127.0.0.1:5000/', data_model)
  .then(response => {
    // console.log(response.data);
    summarized_variable = response.data;

          if(summarized_variable){
            res.redirect('/summarized-output');
            }
            console.log("Summarized Output Shown at Frontend")
  })
  .catch(error => {
    console.error("Failure " + error);
  });
  
      // use the extractedText variable here or pass it to another function
    }).catch(function(err){
      console.log('Error: ', err);
    });
  } 
  
  /////////FOR TXT FILES ////////////////
  else if (extension === 'txt') {
    fs.readFile(filePath, 'utf-8', function (err, txt_data) {
      if (err) return next(err);
      // console.log(txt_data);

      /////////// axios req for txt 

const data_model = {
  text: txt_data ,
  question: userQuery

};

axios.post('http://127.0.0.1:5000/',data_model)
  .then(response => {
    // console.log(response.data);
    summarized_variable = response.data;

          if(summarized_variable){
            res.redirect('/summarized-output');
            }
            
          console.log("Summarized Output Shown at Frontend")
  })
  .catch(error => {
    console.error("Failure " + error);
  });
    });
  } 

      console.log("")
      console.log("Query Fired And Saved in Database");
     
       }
  catch (error){
    console.log(error)
      res.render('welcome' , {message: 'First Upload The Document' , messageType: 'error'});
  }
})

//*******************LIRARIES************************ */

// File Upload Using Multer Library

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Documents/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  } 
});


//Global Variable to access ID
let shared_id = '';

router.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.file);
  
  if (!req.file) {
    return res.status(400).addListener.error;
  }
  else if(req.file > 1 * 1024 * 1024 ){
    res.sendStatus(500);
  }
  else{
  const document = new Document({
    id: req.file.filename,
    originalname: req.file.originalname,
    filename: req.file.filename,
  });
  await document.save();


  shared_id = ''+document._id;
  console.log("Document Successfully Uploaded In Database");
  console.log('')

  res.sendStatus(200);
}
});


//***************************STRATEGIES***************************** */

//STRATEGY FOR GOOGLE

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET_GOOGLE);
        res.cookie('jwt', token, {
           expires:new Date(Date.now() + 3600000),
           httpOnly: true
           });
    req.session.loggedIn = true;
    res.redirect('/home')
  }
)

module.exports = router


