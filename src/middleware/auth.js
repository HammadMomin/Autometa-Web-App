// require('dotenv').config();
const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req, res, next) => {
    try {
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyUser);

        const data = await Register.findOne({_id:verifyUser._id})
        // console.log(data.fullname);

        req.token = token;
        req.data = data;
        
         next();

    } catch (error) {
        res.status(401).send(error); 
    }
}
module.exports = auth;