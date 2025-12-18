const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { userId, item } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [item] });
  } else {
    cart.items.push(item);
  }

  await cart.save();
  res.json(cart);
});

router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { items: [] });
});

router.delete("/remove/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  const cart = await Cart.findOne({ userId });

  if (!cart) return res.json({ items: [] });

  cart.items = cart.items.filter((it) => it.productId !== productId);

  await cart.save();
  res.json(cart);
});

module.exports = router;
