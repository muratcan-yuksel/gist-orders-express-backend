const mongoose = require("mongoose");
const refreshSchema = new mongoose.Schema({
  //   userId: {
  //     type: mongoose.Types.ObjectId,
  //     required: false,
  //   },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    // expires: 3600,
  },
});

module.exports = mongoose.model("RefreshToken", refreshSchema);
