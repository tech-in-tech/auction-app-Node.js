const auctionModel = require("../models/auctionModel");
const bid = require("../models/bidModel");
const userModel = require("../models/userModel");

const placeBidController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.id);
    const auctionId = req.params.id;
    const auctionItem = await auctionModel.findById(auctionId);

    if (!auctionItem) {
      return res.status(404).send({
        success: false,
        message: "Auction Item Not found",
        user,
      });
    }

    const { amount } = req.body;
    if (!amount) {
      return res.status(400).send({
        success: false,
        message: "Please place your bid",
        user,
      });
    }

    if (amount <= auctionItem.currentBid || amount <= auctionItem.startingBid) {
      return res.status(400).send({
        success: false,
        message: "Bid amount must be greater than the current bid",
        user,
      });
    }

    const existingBid = await bid.findOne({
      "bidder.id": user.id,
      auctionItem: auctionItem._id,
    });
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() === req.user._id.toString()
    );

    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save();
      await existingBid.save();
      auctionItem.currentBid = amount;
    } else {
      const bidderDetail = await userModel.findById(req.user._id);
      const newBid = await bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });
      auctionItem.bids.push({
        userId: user.id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount,
      });
      auctionItem.currentBid = amount;
    }
    
    await auctionItem.save();
    res.status(201).send({
      success: true,
      message: "Bid placed",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    console.log("ERROR USERCONTROLLER :: ", error);
    res.status(500).send({
      success: false,
      message: "Error in Place bid API",
      error,
    });
  }
};

module.exports  = {placeBidController};