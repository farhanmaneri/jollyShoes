const express = require('express');
const Order = require('../models/orders');
const { sendOrderConfirmationEmail } = require('../middlewares/Email');

const placeOrder = async (req, res) => {
  try {
    const { userName, email, contact, address, totalPrice, products } =
      req.body;

    // console.log("Received order data:", { userName, email, contact, address, totalPrice, productsCount: products?.length });

    // Validate required fields
    if (!email || !contact || !address || !products || !products.length) {
      // console.log("Validation failed:", { email, contact, address, products });
      return res
        .status(400)
        .json({ 
          success: false, 
          message: "Missing required fields: email, contact, address, and products are required" 
        });
    }

    // Use userName if provided, otherwise use email as fallback
    const orderUserName = userName || email.split('@')[0];

    const order = new Order({
      userName: orderUserName,
      email,
      contact,
      address,
      totalPrice,
      products, // This includes image URLs
      isVerified: true, // Since OTP is already verified in the new flow
    });

    await order.save();
    
    // console.log("Order created successfully:", order._id);
    
    res
      .status(200)
      .json({ 
        success: true, 
        message: "Order placed successfully",
        orderId: order._id
      });

    // Send order confirmation email with order details
    try {
      const orderData = {
        _id: order._id,
        userName: orderUserName,
        email,
        contact,
        address,
        totalPrice,
        products
      };
      await sendOrderConfirmationEmail(orderData);
    } catch (emailError) {
      // console.log("Order confirmation email failed, but order was created:", emailError.message);
    }
  } catch (error) {
    // console.error("Error in placeOrder:", error);
    // Add more error details to help debugging
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = placeOrder;
