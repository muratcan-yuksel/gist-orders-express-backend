const express = require("express");
const router = express.Router();
// const jwtAuthMiddleware = require("../middleware/check-auth");

const {
  getClients,
  getClient,
  createClient,
  deleteClient,
} = require("../controllers/clients");

router.get("/", getClients);
router.post("/", createClient);
router.get("/:id", getClient);
router.delete("/:id", deleteClient);

module.exports = router;
