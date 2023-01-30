const express = require("express");
const router = express.Router();
// const jwtAuthMiddleware = require("../middleware/check-auth");

const {
  generateAccessToken,
  generateRefreshToken,
  refreshTokens,
  verifyToken,
  refreshToken,
} = require("../controllers/auth");

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  loginUser,
} = require("../controllers/users");

router.get("/", verifyToken, getUsers);
router.post("/", verifyToken, createUser);
router.post("/login", loginUser);
router.get("/:id", verifyToken, getUser);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
