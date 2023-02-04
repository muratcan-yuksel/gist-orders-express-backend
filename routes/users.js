const express = require("express");
const router = express.Router();
// const jwtAuthMiddleware = require("../middleware/check-auth");

const {
  generateAccessToken,
  generateRefreshToken,
  refreshTokens,
  verifyToken,
  refreshToken,
  destroyToken,
} = require("../controllers/auth");

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  loginUser,
  updateUser,
} = require("../controllers/users");

router.get("/", verifyToken, getUsers);
router.post("/", verifyToken, createUser);
router.post("/login", loginUser);
router.get("/:id", verifyToken, getUser);
router.delete("/:id", verifyToken, deleteUser);
router.patch("/:id", verifyToken, updateUser);

module.exports = router;
