const mongoose = require("mongoose");

const goldRateSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GoldRate", goldRateSchema);
