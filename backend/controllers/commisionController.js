const userModel = require("../models/userModel")
const commisionModel = require("../models/commisionProofModel")
const cloudinary = require('cloudinary');

const proofOfCommission = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Payment Proof Screenshot required"
      })
    }
    const { proof } = req.files;
    const { amount, comment } = req.body
    const user = await userModel.findById(req.body.id);

    if (!amount || !comment) {
      return res.status(400).send({
        success: false,
        message: "Amount and comment are requred fiels"
      })
    }
    if (user.undaipCommission === 0) {
      return res.status(400).send({
        success: true,
        message: "You dont have any unpaid commisson"
      })
    }

    if (user.undaipCommission < amount) {
      return res.status(403).send({
        success: false,
        message: `The amount exceeds your unpaid commission balance. Please enter an amount up to ${user.unpaidCommission}`
      })
    }

    const allowedFormates = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormates.includes(proof.mimetype)) {
      return res.status(400).send({
        success: false,
        message: "Invalid file type"
      })
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      proof.tempFilePath, {
      folder: "Auction_payment_Proof"
    }
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary error : ", cloudinaryResponse.error || "Unknown cloudinary error")
    }

    const commissionProof = await commisionModel.create({
      userId: user.id,
      proof: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      amount,
      comment,
    });
    res.status(201).json({
      success: true,
      message:
        "Your proof has been submitted successfully. We will review it and responed to you within 24 hours.",
      commissionProof,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in Proof of commision Comtroller"
    })
  }
}


module.exports = { proofOfCommission };
