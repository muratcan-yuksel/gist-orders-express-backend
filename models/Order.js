const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      stockCode: { type: String, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      personalization: { type: String, required: false },
      notes: { type: String, required: false },
      //   user: {   // This is the user who created the order
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "User",
      //     required: true,
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
