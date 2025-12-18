const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/place", auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least 1 item",
      });
    }

    const userId = req.user.userId;

    const order = new Order({
      userId,
      items,
      totalAmount,
      status: "Pending",
      progress: 0,
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Order error:", err);
    return res.status(500).json({
      success: false,
      message: "Error placing order",
      error: err.message,
    });
  }
});

router.put("/update/:orderId", auth, async (req, res) => {
  try {
    const { status, progress } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, progress },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      order: updated,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
});

router.get("/:userId", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

module.exports = router;
