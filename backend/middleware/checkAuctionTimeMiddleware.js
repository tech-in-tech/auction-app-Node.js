const mongoose = require('mongoose');
const auctionModel = require("../models/auctionModel");
const JWT = require('jsonwebtoken')
module.exports = async(req,res,next)=>{
  try {
    const auctionId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(auctionId)){
      return res.status(400).send({
        success:false,
        message:'Invalid Auction ID',
        error
      }) 
    }
    const auction = await auctionModel.findById(auctionId);
    if(!auction){
      return res.status(404).send({
        success:false,
        message:'Auction Not Found',
        error
      }) 
    }
    console.log(now);
    if(new Date(auction.startTime)>now){
      return res.status(400).send({
        success:false,
        message:'Auction is not started',
      }) 
    }

    if(new Date(auction.endTime)<now){
      return res.status(400).send({
        success:false,
        message:'Auction is ended',
        error
      }) 
      // console.log(true);
    }
    next();
  } catch (error) {
    console.log("authMiddleware ERROR :: ",error)
    res.status(500).send({
      success:false,
      message:'Error in Check auction time middleware',
      error
    })
  }
}