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

module.exports = { getUserController ,deleteUserController};