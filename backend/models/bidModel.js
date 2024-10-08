const mongoose =require("mongoose");

const bidSchema = new mongoose.Schema({
  amount: Number,
  bidder: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: String,
    profileImage: String,
  },
  auctionItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
});

module.exports = mongoose.model("Bid", bidSchema)