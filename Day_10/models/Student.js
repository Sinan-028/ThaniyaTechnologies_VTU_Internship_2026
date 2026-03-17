const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
      name: String,
  course: String,
  skills: [String]

});

module.exports = mongoose.model("student",studentSchema);