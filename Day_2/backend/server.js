const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));