const mongoose = require("mongoose");
const Product = require("../models/products");

// ✅ Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    // console.error("Error fetching products:", err.message);
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

    res.json(product);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// ✅ Create product
const createProduct = async (req, res) => {
  try {
    const { title, description, category, image, price, sizes } = req.body;

    const product = new Product({
      title,
      description,
      category,
      image,
      price: Number(price) || 0,
      sizes: sizes || [], // expect array like [{ size: 40, stock: 10 }]
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    // console.error("Error creating product:", error);
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

    res.json({
      data: updated,
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
