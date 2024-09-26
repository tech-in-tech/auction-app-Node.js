const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const cloudinary = require('cloudinary')

// Register
const registerController = async (req, res) => {
  try {
    // cloudinary
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Profile image is Required",
      });
    }
    const { profileImage } = req.files
    const allowedFormates = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormates.includes(profileImage.mimetype)) {
      return res.status(400).send({
        success: false,
        message: "Invalid file type"
      })
    }

    const { userName,
      password,
      email,
      phone,
      address,
      bankAccountNumber,
      bankAccountName,
      bankName,
      role,
      easypaisaAccountNumber,
      paypalEmail } = req.body;
    // validation
    if (!userName) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your name"
      })
    }
    if (!address) {
      return res.status(500).send({
        success: false,
        message: "Please Provide address"
      })
    }
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your email"
      })
    }
    if (!phone) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your contact Number"
      })
    }

    if (!role) {
      return res.status(500).send({
        success: false,
        message: "Please provide your role [Auctioneer, Bidder, Super Admin]"
      })
    }

    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Password"
      })
    }

    if (role == "Auctioneer") {
      if (!bankAccountNumber) {
        return res.status(500).send({
          success: false,
          message: "Please Provide bankAccountNumber"
        })
      }

      if (!bankAccountName) {
        return res.status(500).send({
          success: false,
          message: "Please Provide bankAccountName"
        })
      }

      if (!bankName) {
        return res.status(500).send({
          success: false,
          message: "Please Provide bankName,"
        })
      }
      if (!paypalEmail) {
        return res.status(500).send({
          success: false,
          message: "Please Provide paypalEmail,"
        })
      }
    }

    // Check User
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "Email Already Registered please Login"
      })
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      profileImage.tempFilePath, {
      folder: "Auction_App_User"
    }
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary error : ", cloudinaryResponse.error || "Unknown cloudinary error")
    }
    // Hashing Password
    let salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // creating new User
    const user = await userModel.create({
      userName,
      password: hashedPassword,
      email,
      phone,
      address, profileImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
        easypaisa: {
          easypaisaAccountNumber,
        },
        paypal: {
          paypalEmail,
        },
      },
    })
    res.status(201).send({
      success: true,
      message: "Successfully Register",
      user: user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registor API | registerController",
      Error: error
    })
  }
}


// !Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Email is required"
      })
    }
    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Password is required"
      })
    }

    // !Check user
    const user = await userModel.findOne({ email })
    // Valdation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User Not Found'
      })
    }
    // Check user password || comare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = JWT.sign({ id: user._id },
      process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    }
    )
    res.status(200).send({
      success: true,
      message: "Login successfully",
      token,
      user,
    })
  }  catch (error) {
    console.log("LoginController :: ", error);
    res.status(500).send({
      success: false,
      message: 'Error in Login API',
      error
    })
  }
}

module.exports = { registerController, loginController }