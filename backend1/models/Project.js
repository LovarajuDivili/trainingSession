const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jiraCode: { type: String, required: true },
  owner: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Project", projectSchema);
