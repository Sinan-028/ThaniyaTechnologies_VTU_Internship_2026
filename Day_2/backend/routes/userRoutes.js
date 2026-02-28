const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(400).json("Name required");

    const user = new User(req.body);
    await user.save();
    res.json(user);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
module.exports = router;