const auctionModel = require("../models/auctionModel");
const mongoose = require("mongoose")
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


// Get All Auction
const getAllAuctionItems = async(req,res)=>{
  try {
    let items = await auctionModel.find();
    if(!items){
      return res.status(400).send({
        success: false,
        message: "Items Not Found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Get Items Successfully",
      items
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error is get all auction items"
    })
  }
}

// Get single auction by ID
const getSingleAuction = async(req,res)=>{
  try {
    const auctionId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(auctionId)){
      return res.status(400).send({
        success: false,
        message: "Invalid ID"
      }) 
    }
    const auctionItem  = await auctionModel.findById(auctionId);
    if(!auctionItem){
      return res.status(404).send({
        success: false,
        message: "Auction Not Found"
      }) 
    }
    const bidders  = auctionItem.bids.sort((a,b)=>b.bid-a.bid);
    return res.status(200).send({
      success: true,
      message: "Auction get Successfully",
      auctionItem,
      bidders
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in get single auction"
    })
  }
}

// Get My Auction
const getMyAuctionItem = async(req,res)=>{
  try {
    const user = await userModel.findById({ _id: req.body.id })
    const items = await auctionModel.find({createdBy:user.id});
    if(!items){
      return res.status(400).send({
        success: false,
        message: "No Auction Items found"
      })
    }
    return res.status(500).send({
      success: true,
      message: "Auction Items Get successfully",
      items
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in get My auction API"
    })
  }
}

// Delete Auction
const deleteAuctionController = async(req,res)=>{
  try {
    const auctionId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(auctionId)){
      return res.status(400).send({
        success: false,
        message: "Invalid ID"
      }) 
    }
    const auctionItem = await auctionModel.findById(auctionId);
    if(!auctionItem){
      return res.status(404).send({
        success: false,
        message: "Auction Not Found"
      })
    }
    await auctionItem.deleteOne();
    return res.status(200).send({
      success: true,
      message: "Auction Item Deleted Successfully"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in Delete My auction API"
    })
  }
}

// Republish Item
const republishItem = async(req,res)=>{
  try {
    const auctionId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(auctionId)){
      return res.status(400).send({
        success: false,
        message: "Invalid ID"
      }) 
    }
    let auctionItem = await auctionModel.findById(auctionId);
    if(!auctionItem){
      return res.status(404).send({
        success: false,
        message: "Auction Not Found"
      })
    }
    if(!req.body.startTime || req.body.endTime){
      return res.status(400).send({
        success: false,
        message: "Start time and End time for repiblish is mendtery"
      }); 
    }
    if(new Date(auctionItem.endTime)>Date.now()){
      return res.status(400).send({
        success: false,
        message: "Auction is Already Active Cannot republish"
      })
    }
    let data= {
      startTime:new Date(req.body.startTime),
      endTime:new Date(req.body.endTime)
    }
    if(data.startTime < Date.now()){
      return res.status(400).send({
        success: false,
        message: "Auction Starting Time must be greater then Current time"
      })
    }

    if(data.startTime >= data.endTime){
      return res.status(400).send({
        success: false,
        message: "Auction Starting Time must be Less then Current time"
      })
    }

    data.bids=[];
    data.comm = false;
    auctionItem = await auctionModel.findByIdAndUpdate(auctionId,data,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    });
    const createdBy = await userModel.findByIdAndUpdate(user._id,{unpaidCommission:0},{
      new:true,
      runValidators:false,
      useFindAndModify:false
    }
  )
    return res.status(200).send({
      success: false,
      message: `Auction republish and will be active on ${req.body.startTime}`,
      createdBy
    });

  }  catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in Republish Item API"
    })
  }
}


module.exports = { addNewAuctionItem,getAllAuctionItems,getSingleAuction,getMyAuctionItem,deleteAuctionController}