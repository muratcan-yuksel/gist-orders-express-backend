const express = require("express");
const router = express.Router();
// const jwtAuthMiddleware = require("../middleware/check-auth");

const { refreshToken } = require("../controllers/auth");

router.post("/refresh", refreshToken);

module.exports = router;
