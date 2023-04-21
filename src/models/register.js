const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Creating Schema of Database
const userSchema = new mongoose.Schema({
    fullname : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    verificationCode : {
        type:String
    },
    is_verified:{
        type:Number,
        default:0
    },
    randomstring : {
        type:String,
        default : ''

    }
})
//Generating Tokens 
userSchema.methods.generateAuthToken = async function(){
    try {
        //console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;  
    } catch (error) {
        res.send("the error part" + error);
        //console.log("the error part" + error);   
    }
}

//Applying Hashing Algorithm For Password 
userSchema.pre("save", async function(next){

    if(this.isModified("password")){
        //console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
       // console.log(`the curret password is ${this.password}`);
    }
    next();
})

//Creating Collections in Database
const Register = new mongoose.model("users", userSchema);
module.exports = Register;