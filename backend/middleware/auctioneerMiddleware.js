const userModel = require("../models/userModel")
module.exports = async(req,res,next)=>{
  try{
    const user = await userModel.findById(req.body.id)
    if(user.role!=="Auctioneer"){
      return res.status(403).send({
        success:false,
        message:"Your are not allow to create Auction"
      })
    }
    else{
      next()
    }
  }
  catch (error) {
    console.log("auctioneerMiddleware ERROR :: ",error)
    res.status(500).send({
      success:false,
      message:'Error in auctioneerMiddleware',
      error
    })
  }
}