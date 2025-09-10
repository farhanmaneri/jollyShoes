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

    // Dynamic price fields
    weightInGrams: {
      type: Number,
      default: 0, // Only used if category === "gold"
    },
    makingCharges: {
      type: Number,
      default: 0, // Extra labor charges (optional)
    },
    price: {
      type: Number,
      default: 0, // For non-gold items, admin sets manually
    },
  },
  { timestamps: true }
);

// Virtual field for final price
productSchema.virtual("finalPrice").get(function () {
  return this._calculatedPrice ?? this.price;
});

// Method to calculate price dynamically
productSchema.methods.setDynamicPrice = function (ratePerGram) {
  if (this.category.toLowerCase() === "gold") {
    this._calculatedPrice =
      (this.weightInGrams || 0) * (ratePerGram || 0) + (this.makingCharges || 0);
  } else {
    this._calculatedPrice = this.price;
  }
};

module.exports = mongoose.model("Product", productSchema);
