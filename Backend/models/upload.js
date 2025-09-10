const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    filename: String,
    url: String,
  });
  const File = mongoose.model('file', fileSchema);

  module.exports = File;