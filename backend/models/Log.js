const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  name: { type: String },            
  action: { type: String, required: true },
  status: { type: String, default: "Success" },
  details: { type: Object, default: {} },
  date: { type: String },
  time: { type: String }
});

module.exports = mongoose.model("Log", logSchema);
