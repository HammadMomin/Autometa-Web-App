const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
    query : {
        type:String,
        required:true
    }
});

//Creating Collections in Database
const Query = new mongoose.model("queries", QuerySchema);
module.exports = Query;