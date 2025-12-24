const mongoose = require("mongoose");

const accountantSchema = new mongoose.Schema({
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AccountantItem", accountantSchema);
