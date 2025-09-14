const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");
const { sendOrderConfirmationEmail } = require("../middlewares/Email");

const placeOrder = async (req, res) => {
  try {
    const { userName, email, contact, address, totalPrice, products } =
      req.body;

    // Validate required fields
    if (!email || !contact || !address || !products || !products.length) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: email, contact, address, and products are required",
      });
    }

    const orderUserName = userName || email.split("@")[0];

    // Validate stock for each product
    for (const cartItem of products) {
      const { _id, selectedSize, quantity } = cartItem;

      if (!_id || !selectedSize || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product data in cart",
        });
      }

      // Find the product
      const product = await Product.findById(_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${_id} not found`,
        });
      }

      // Find the matching size (handle string/number comparison)
      const sizeObj = product.sizes.find(
        (s) => s.size.toString() === selectedSize.toString()
      );

      if (!sizeObj) {
        return res.status(400).json({
          success: false,
          message: `Size ${selectedSize} is not available for ${product.title}`,
        });
      }

      // Check stock availability
      if (sizeObj.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title} (Size ${selectedSize}). Available: ${sizeObj.stock}, Requested: ${quantity}`,
        });
      }
    }

    // Start database transaction
    const session = await mongoose.startSession();
    let order;

    try {
      session.startTransaction();

      // Create the order
      order = new Order({
        userName: orderUserName,
        email,
        contact,
        address,
        totalPrice,
        products: products.map((p) => ({
          _id: p._id,
          title: p.title,
          price: p.price,
          quantity: p.quantity,
          size: p.selectedSize,
          image: p.image,
        })),
        isVerified: true,
      });

      await order.save({ session });

      // Update stock for each product
      for (const cartItem of products) {
        const { _id: productId, selectedSize: size, quantity } = cartItem;

        const product = await Product.findById(productId).session(session);
        if (!product) {
          throw new Error(`Product ${productId} not found during stock update`);
        }

        const sizeIndex = product.sizes.findIndex(
          (s) => s.size.toString() === size.toString()
        );

        if (sizeIndex === -1) {
          throw new Error(
            `Size ${size} not found for product ${productId} during stock update`
          );
        }

        // Reduce stock
        product.sizes[sizeIndex].stock -= quantity;

        // Remove size if stock is 0 or less
        if (product.sizes[sizeIndex].stock <= 0) {
          product.sizes.splice(sizeIndex, 1);
        }

        await product.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Order placed successfully and stock updated!",
      orderId: order._id,
    });

    // Send order confirmation email (async, don't block response)
    try {
      const orderData = {
        _id: order._id,
        userName: orderUserName,
        email,
        contact,
        address,
        totalPrice,
        products,
      
      };
      // console.log(products)
      await sendOrderConfirmationEmail(orderData);
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = placeOrder;
