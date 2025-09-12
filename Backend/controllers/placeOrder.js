const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");
const { sendOrderConfirmationEmail } = require("../middlewares/Email");

const placeOrder = async (req, res) => {
  console.log("🚀 placeOrder function started");

  try {
    const { userName, email, contact, address, totalPrice, products } =
      req.body;

    console.log("Received order data:", {
      userName,
      email,
      contact,
      address,
      totalPrice,
      productsCount: products?.length,
    });

    // Validate required fields
    if (!email || !contact || !address || !products || !products.length) {
      console.log("❌ Validation failed:", {
        email,
        contact,
        address,
        products,
      });
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: email, contact, address, and products are required",
      });
    }

    const orderUserName = userName || email.split("@")[0];

    // Stock validation with robust size matching
    console.log(
      "🔍 Starting stock validation for",
      products.length,
      "products"
    );

    for (let i = 0; i < products.length; i++) {
      const cartItem = products[i];
      const { _id, selectedSize, quantity } = cartItem;

      console.log(`📦 Checking product ${i + 1}:`, {
        _id,
        selectedSize,
        quantity,
        selectedSizeType: typeof selectedSize,
      });

      if (!_id || !selectedSize || !quantity || quantity <= 0) {
        console.log("❌ Invalid product data:", cartItem);
        return res.status(400).json({
          success: false,
          message: "Invalid product data in cart",
        });
      }

      // Find the product
      console.log(`🔍 Finding product with ID: ${_id}`);
      const product = await Product.findById(_id);

      if (!product) {
        console.log(`❌ Product not found: ${_id}`);
        return res.status(404).json({
          success: false,
          message: `Product ${_id} not found`,
        });
      }

      console.log(`✅ Product found: ${product.title}`);
      console.log(
        `📏 Available sizes:`,
        product.sizes.map((s) => ({
          size: s.size,
          stock: s.stock,
          sizeType: typeof s.size,
        }))
      );

      // Robust size matching function
      const findSizeMatch = (sizes, targetSize) => {
        // Convert targetSize to both string and number for comparison
        const targetSizeStr = String(targetSize);
        const targetSizeNum = Number(targetSize);

        console.log(
          `🎯 Looking for size: ${targetSize} (original type: ${typeof targetSize})`
        );
        console.log(
          `🎯 Converted to string: "${targetSizeStr}", to number: ${targetSizeNum}`
        );

        return sizes.find((sizeObj) => {
          const dbSize = sizeObj.size;
          const dbSizeStr = String(dbSize);
          const dbSizeNum = Number(dbSize);

          // Try multiple comparison methods
          const exactMatch = dbSize === targetSize;
          const stringMatch = dbSizeStr === targetSizeStr;
          const numberMatch = dbSizeNum === targetSizeNum;
          const looseMatch = dbSize == targetSize; // loose equality

          console.log(
            `📏 DB size ${dbSize} (${typeof dbSize}): exact=${exactMatch}, string=${stringMatch}, number=${numberMatch}, loose=${looseMatch}`
          );

          return exactMatch || stringMatch || numberMatch || looseMatch;
        });
      };

      // Find the matching size using robust matching
      const sizeObj = findSizeMatch(product.sizes, selectedSize);

      if (!sizeObj) {
        console.log(`❌ Size not found: ${selectedSize} for ${product.title}`);
        console.log(
          `Available sizes: [${product.sizes
            .map((s) => `${s.size} (${typeof s.size})`)
            .join(", ")}]`
        );
        return res.status(400).json({
          success: false,
          message: `Size ${selectedSize} is not available for ${product.title}`,
        });
      }

      console.log(
        `📏 Size found: ${sizeObj.size}, Stock: ${sizeObj.stock}, Requested: ${quantity}`
      );

      // Check if enough stock available
      if (sizeObj.stock < quantity) {
        console.log(
          `❌ Insufficient stock for ${product.title} size ${selectedSize}`
        );
        console.log(`Available: ${sizeObj.stock}, Requested: ${quantity}`);

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title} (Size ${selectedSize}). Available: ${sizeObj.stock}, Requested: ${quantity}`,
        });
      }
    }

    console.log("✅ Stock validation passed, proceeding with order creation");

    // Start MongoDB session for transaction
    const session = await mongoose.startSession();
    let order;

    try {
      session.startTransaction();
      console.log("🔄 Transaction started");

      // Create the order
      order = new Order({
        userName: orderUserName,
        email,
        contact,
        address,
        totalPrice,
        // If you use the improved schema, update the controller mapping to:

        products: products.map((p) => ({
          _id: p._id,
          title: p.title,
          price: p.price,
          quantity: p.quantity,
          size: p.selectedSize, // Now size is stored in order
          image: p.image,
          description: p.description, // If available
          brand: p.brand, // If available
          weightInGrams: p.weightInGrams, // If available
        })),
        isVerified: true,
      });

      await order.save({ session });
      console.log("✅ Order saved successfully");

      // Update stock for each product within transaction
      for (const cartItem of products) {
        const { _id: productId, selectedSize: size, quantity } = cartItem;

        const product = await Product.findById(productId).session(session);
        if (!product) {
          throw new Error(`Product ${productId} not found during stock update`);
        }

        // Use the same robust matching for stock update
        const sizeIndex = product.sizes.findIndex((s) => {
          const dbSize = s.size;
          const targetSize = size;

          return (
            dbSize === targetSize ||
            String(dbSize) === String(targetSize) ||
            Number(dbSize) === Number(targetSize) ||
            dbSize == targetSize
          );
        });

        if (sizeIndex === -1) {
          throw new Error(
            `Size ${size} not found for product ${productId} during stock update`
          );
        }

        // Reduce stock
        product.sizes[sizeIndex].stock -= quantity;

        // If stock <= 0, remove the size from array
        if (product.sizes[sizeIndex].stock <= 0) {
          product.sizes.splice(sizeIndex, 1);
        }

        await product.save({ session });
        console.log(`✅ Stock updated for ${product.title} size ${size}`);
      }

      await session.commitTransaction();
      console.log("✅ Transaction committed successfully");
    } catch (error) {
      await session.abortTransaction();
      console.log("❌ Transaction aborted:", error.message);
      throw error;
    } finally {
      session.endSession();
    }

    console.log("✅ Order created and stock updated successfully:", order._id);

    const successResponse = {
      success: true,
      message: "Order placed successfully and stock updated!",
      orderId: order._id,
    };

    console.log("📤 Sending success response:", successResponse);
    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("❌ Error in placeOrder:", error);

    const errorResponse = {
      success: false,
      message: error.message || "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };

    console.log("📤 Sending error response:", errorResponse);
    return res.status(500).json(errorResponse);
  }
};

module.exports = placeOrder;
