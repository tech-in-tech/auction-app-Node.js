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

// Update Password Controller
const updateUserPasswordController = async(req,res)=>{
  try {
    const user = await userModel.findById({ _id: req.body.id })
    // validation
    if (!user) {
      return res.status(404).send({
        seccess: false,
        message: 'User Not Found'
      })
    }
    // get data from user
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide old or new password'
      })
    }
    // Check user password || compare password 
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old Password",
      });
    }
    // Hashing password
    let salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: 'Password Update'
    })
  }  catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in Password Update API',
      error
    })
  }
}

module.exports = { getUserController ,deleteUserController,fetchLeaderboardController,updateUserPasswordController};