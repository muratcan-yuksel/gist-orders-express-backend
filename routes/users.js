const express = require("express");
const router = express.Router();
// const jwtAuthMiddleware = require("../middleware/check-auth");

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  loginUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

module.exports = router;
