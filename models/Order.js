const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: { type: String, required: true },
  stockCode: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  personalization: { type: String, required: false },
  note: { type: String, required: false },
  file: { type: String, required: false },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
