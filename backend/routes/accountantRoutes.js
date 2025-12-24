const express = require("express");
const AccountantItem = require("../models/AccountantItem");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const items = await AccountantItem.find();
  const accountant = {
    _id: "ACCOUNTANT_01",
    role: "Accountant",
  };

  res.json({ accountant, items });
});

router.post("/", auth, async (req, res) => {
  const newItem = new AccountantItem({
    category: req.body.category,
    brand: req.body.brand,
    model: req.body.model,
    price: req.body.price
  });

  const saved = await newItem.save();
  res.status(201).json(saved);
});

router.delete("/:id", auth, async (req, res) => {
  await AccountantItem.findOneAndDelete({ _id: req.params.id });
  res.json({ message: "Item deleted" });
});

module.exports = router;
