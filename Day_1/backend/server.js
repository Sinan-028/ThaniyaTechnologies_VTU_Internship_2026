const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// GET USERS
app.get("/users", (req, res) => {
  res.json(users);
});

// ADD USER
app.post("/users", (req, res) => {
  const user = req.body;
  user.id = Date.now();
  users.push(user);
  res.json(user);
});

// DELETE USER
app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server restarted!"));