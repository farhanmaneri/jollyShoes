
// controllers/orders.js
const Order = require("../models/orders");

// ✅ Admin: get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ✅ User: get own orders (optional, if you want users to see their history)
const getUserOrders = async (req, res) => {
  try {
    const { email } = req.user; // assuming you store email in JWT
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

module.exports = { getOrders, getUserOrders };
