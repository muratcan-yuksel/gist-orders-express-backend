const express = require("express");
const router = express.Router();
// const jwtAuthMiddleware = require("../middleware/check-auth");

const { refreshToken, destroyToken } = require("../controllers/auth");

router.post("/refresh", refreshToken);
router.post("/logout", destroyToken);

module.exports = router;
