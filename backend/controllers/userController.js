const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

// GET USER INFO
const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id })
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found"
      })
    }
    // res send
    res.status(200).send({
      success: true,
      message: "User get Successfully",
      user
    })
  } catch (error) {
    console.log("ERROR USERCONTROLLER :: ", error)
    res.status(500).send({
      success: false,
      message: "Error in get user API",
      error
    })
  }
}

// Logout 
const deleteUserController = async (req,res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success:true,
      message:'Logout Successfully',
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in DELETE profile API",
      error
    })
  }
}

// featch leader board
const fetchLeaderboardController = async(req,res)=>{
  try {
    const users = await userModel.find({moneySpent:{$gt:0}});
    const leaderBoard = users.sort((a,b)=>b.moneySpent-a.moneySpent);
    res.status(200).send({
      success: true,
      message: "LeaderBoard get Successfully",
      leaderBoard
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Fetch Leader API",
      error
    })
  }
}

module.exports = { getUserController ,deleteUserController,fetchLeaderboardController};