const express = require("express");
const router = express.Router();

const { getProfile } = require("../controllers/profileController");
const Report = require("../models/Report");

router.get("/:username", getProfile);

router.get("/report/:username", async (req, res) => {
  try {
    const report = await Report.findOne({ username: req.params.username });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/compare/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const report1 = await Report.findOne({ username: user1 });
    const report2 = await Report.findOne({ username: user2 });

    if (!report1 || !report2) {
      return res.status(404).json({ error: "One or both users not found" });
    }

    res.json({
      user1: report1,
      user2: report2,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
