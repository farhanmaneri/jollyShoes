const mongoose = require("mongoose");
const Product = require("../models/products");
const GoldRate = require("../models/goldRate");

// ✅ Get all products
const getProducts = async (req, res) => {
  try {
    const goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
    const ratePerGram = goldRate ? goldRate.rate : 0;

    const products = await Product.find();

    const updatedProducts = products.map((p) => {
      p.setDynamicPrice(ratePerGram);
      return {
        ...p.toObject(),
        finalPrice: p.finalPrice, // dynamic price
      };
    });

    res.json(updatedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ Get single product
const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
    const ratePerGram = goldRate ? goldRate.rate : 0;

    product.setDynamicPrice(ratePerGram);

    res.json({ ...product.toObject(), finalPrice: product.finalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// ✅ Create product
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image,
      weightInGrams,
      makingCharges,
      price,
    } = req.body;

    const product = new Product({
      title,
      description,
      category,
      image,
      weightInGrams: Number(weightInGrams) || 0,
      makingCharges: Number(makingCharges) || 0,
      price: Number(price) || 0, // stored only for non-gold
    });

    await product.save();

    // Apply latest rate for response
    const goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
    const ratePerGram = goldRate ? goldRate.rate : 0;
    product.setDynamicPrice(ratePerGram);

    res
      .status(201)
      .json({ ...product.toObject(), finalPrice: product.finalPrice });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ✅ Update product
const editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    // Apply latest rate for response
    const goldRate = await GoldRate.findOne().sort({ updatedAt: -1 });
    const ratePerGram = goldRate ? goldRate.rate : 0;
    updated.setDynamicPrice(ratePerGram);

    res.json({
      data: { ...updated.toObject(), finalPrice: updated.finalPrice },
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
