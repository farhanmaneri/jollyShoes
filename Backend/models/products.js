const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String, // URL or Cloudinary link
      required: [true, "Image is required"],
    },

    // 👟 Shoe-specific fields
    sizes: [
      {
        size: {
          type: Number, // e.g. 38, 39, 40, 41
          required: true,
        },
        stock: {
          type: Number, // number of shoes available for that size
          default: 0,
        },
      },
    ],

    price: {
      type: Number,
      required: [true, "Price is required"], // fixed price (no dynamic gold logic)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
