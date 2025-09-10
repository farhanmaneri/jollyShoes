// Backend/controllers/goldRate.js
const GoldRate = require("../models/goldRate");

// Get the latest gold rate
const getGoldRate = async (req, res) => {
  try {
    const rate = await GoldRate.findOne().sort({ updatedAt: -1 });
    if (!rate) {
      return res.status(404).json({ message: "No gold rate found" });
    }
    res.json(rate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or update gold rate
const setGoldRate = async (req, res) => {
  try {
    const { rate } = req.body;
    if (!rate) {
      return res.status(400).json({ message: "Rate is required" });
    }

    const newRate = new GoldRate({ rate });
    await newRate.save();
    res.json(newRate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGoldRate, setGoldRate };
