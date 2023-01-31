const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");

const {
  generateAccessToken,
  generateRefreshToken,
  refreshTokens,
  verifyToken,
  refreshToken,
} = require("../controllers/auth");

const {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/orders");

router.route("/").get(verifyToken, getOrders);
router.route("/create").post(upload.single("file"), verifyToken, createOrder);
router
  .route("/:id")
  .get(verifyToken, getOrder)
  .delete(verifyToken, deleteOrder)
  .patch(verifyToken, updateOrder);

module.exports = router;
