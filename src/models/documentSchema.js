const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  id: {
    type :String,
  },
  originalname: {
    type :String,
  },
  filename: {
    type :String,
  },
  query: {
    type :String,
    default : ''
  },
  content: {
    type : String,
    default: ''
  }
});

//Creating Collections in Database
const Document = mongoose.model('Document', documentSchema);
module.exports = Document;