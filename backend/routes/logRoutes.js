const express = require("express");
const Log = require("../models/Log");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const logs = await Log.find().sort({ _id: -1 });
    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
