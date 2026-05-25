const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({

  subject: String,

  branch: String,

  semester: String,

  username: String,

    file: String,
   
});

module.exports = mongoose.model("Note", noteSchema);