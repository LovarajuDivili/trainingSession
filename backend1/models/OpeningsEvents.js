
const mongoose = require("mongoose");

const eventImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const jobOpeningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: "" },
  openings: { type: Number, default: 0 },
  requirements: { type: [String], default: [] }
});

const openingsEventsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  eventImages: { type: [eventImageSchema], default: [] },
  jobOpenings: { type: [jobOpeningSchema], default: [] }
});

module.exports = mongoose.model("OpeningsEvents", openingsEventsSchema);