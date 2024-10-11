const mongoose = require("mongoose");

const commisionSchema = new mongoose.Schema({
  amount: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming user refers to a User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true }); // Correct placement of timestamps

module.exports = mongoose.model("Commission", commisionSchema);
