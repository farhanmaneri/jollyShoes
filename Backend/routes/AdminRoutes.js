const express = require("express");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/VerifyToken");
const { getUsers } = require("../controllers/user");
const {
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/products");
const GoldRate = require("../models/goldRate.js");
const { addUpload } = require("../controllers/upload");
const multer = require("multer");
const { getOrders } = require("../controllers/getOrders");
const { getGoldRate, setGoldRate } = require("../controllers/goldRate.js");

const upload = multer({ storage: multer.memoryStorage() });

const AdminRoutes = express.Router();
AdminRoutes.get("/orders", authMiddleware, adminMiddleware, getOrders);

AdminRoutes.get("/users", authMiddleware, adminMiddleware, getUsers);
AdminRoutes.post("/", authMiddleware, adminMiddleware, createProduct);
AdminRoutes.put("/:id", authMiddleware, adminMiddleware, editProduct);
AdminRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
AdminRoutes.post("/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  addUpload
);
AdminRoutes.post(
  "/gold-rate",
  authMiddleware,
  adminMiddleware,
  setGoldRate
);
AdminRoutes.get("/gold-rate", authMiddleware, adminMiddleware, getGoldRate);
module.exports = AdminRoutes;
