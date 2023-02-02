const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stockCode: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  personalization: { type: String, required: false },
  notes: { type: String, required: false },
  file: { type: String, required: true },
  status: { type: String, default: "active" },
});

module.exports = mongoose.model("Order", orderSchema);
