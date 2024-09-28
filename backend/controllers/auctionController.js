const auctionModel = require("../models/auctionModel");
const userModel = require("../models/userModel");
const cloudinary = require("cloudinary")
// const bcrypt = require('bcryptjs');

// GET USER INFO
const addNewAuctionItem = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.id })
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Auction Item image is Required",
      });
    }
    const { image } = req.files
    const allowedFormates = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormates.includes(image.mimetype)) {
      return res.status(400).send({
        success: false,
        message: "Invalid file type"
      })
    }
    const { title, description, category, condition, startingBid, startTime, endTime } = req.body;
    if (!title || !description || !category || !condition || !startingBid || !startTime || !endTime) {
      return res.status(400).send({
        success: false,
        message: "Please Provide all detailes"
      })
    }
    if (new Date(startTime) < Date.now()) {
      return res.status(400).send({
        success: false,
        message: "Auction Starting time must be greater then present time"
      })
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).send({
        success: false,
        message: "Auction Starting time must be less then ending time"
      })
    }
    const alreadyOneAuctionActive = await auctionModel.find({
      createdBy: user.id,
      endTime: { $gt: Date.now() },
    });
    if (alreadyOneAuctionActive.length>0) {
      return res.status(400).send({
        success: false,
        message: "You already have one auction active"
      })
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath, {
      folder: "Auction_App_Auction"
    }
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary error : ", cloudinaryResponse.error || "Unknown cloudinary error")
    }
    const auctionItem = await auctionModel.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url
      },
      createdBy: user.id
    })
    return res.status(200).send({
      success: true,
      message: `Auction Item created ane listed on auction page at ${startTime}`,
      auctionItem
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Failed to create auction"
    })
  }
}

module.exports = { addNewAuctionItem }