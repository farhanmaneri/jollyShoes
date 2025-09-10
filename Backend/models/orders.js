const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: String, // Add image field

        description: { type: String },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
// uniqueness of Order in db removed