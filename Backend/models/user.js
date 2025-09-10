const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      select: false, // Prevents password from being returned in queries
    },
    facebookId: { type: String, unique: true, sparse: true },
    picture: String,

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    googleId: { type: String, unique: true, sparse: true },
    picture: String,

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String, // Fixed typo
    verificationTokenExpiresAt: Date, // Fixed typo
  },
  { timestamps: true }
);

const Users = mongoose.model("User", usersSchema);

module.exports = Users;
