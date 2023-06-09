const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
    },
    contact : {
        type:String,
        required:true
    },
    message : {
        type:String,
        required:true
    }
})

//Creating Collections in Database
const contact = new mongoose.model("contact", ContactSchema);
module.exports = contact;