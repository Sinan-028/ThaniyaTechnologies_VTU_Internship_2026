const express = require("express");
const mongoose = require("mongoose");

const Student = require("./models/Student");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/studentDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  app.post("/add-student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.send("Student Added Successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});