const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  id: String,
  originalname: String,
  filename: String,
});

//Creating Collections in Database
const Document = mongoose.model('Document', documentSchema);
module.exports = Document;