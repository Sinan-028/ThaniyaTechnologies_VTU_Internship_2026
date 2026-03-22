const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Report = require("./models/Report");

dotenv.config();

const app = express();


connectDB();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Model loaded:", Report.modelName);