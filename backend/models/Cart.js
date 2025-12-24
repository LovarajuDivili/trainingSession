const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", CartSchema);
