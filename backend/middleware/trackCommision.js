const userModel = require("../models/userModel");

module.exports = async(req,res,next)=>{
  try {
    const user = await userModel.findById({ _id: req.body.id })
    if(user.unpaidCommission>0){
      return res.status(403).send({
        success: false,
        message: "You have unpaid Commision Please pay them before posting a new auction"
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in track commision middleware"
    })
  }
}