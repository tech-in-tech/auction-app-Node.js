const auctionModel = require("../models/auctionModel");
const commission = require("../models/commissionModel")
const mongoose = require("mongoose")
const paymentProof = require("../models/commisionProofModel")
const userModel = require("../models/userModel");

const deleteAuctionController = async (req, res) => {
  try {
    const auctionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid ID"
      })
    }
    const auctionItem = await auctionModel.findById(auctionId);
    if (!auctionItem) {
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

const getAllPaymentProofController = async (req, res) => {
  // Correct the model name to 'PaymentProof'
  let paymentProofs = await paymentProof.find();

  return res.status(200).send({
    success: true,
    message: "All payment proofs fetched successfully", // Updated message grammar
    paymentProofs, // Use the correct variable
  });
};


const getPaymentProofDetailController = async (req, res) => {
  const { id } = req.params;
  const paymentProofDetails = await paymentProof.findById(id);
  return res.status(200).send({
    success: true,
    paymentProofDetails
  })
}

const updateProofStatusController = async (req, res) => { // Add 'async' here
  const { id } = req.params;
  const { amount, status } = req.body;

  // Check for valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ // Use 400 status for invalid request
      success: false,
      message: "Invalid ID format",
    });
  }

  // Find the PaymentProof by ID
  let proof = await paymentProof.findById(id);
  if (!proof) {
    return res.status(404).send({
      success: false,
      message: "Payment Proof not found",
    });
  }

  // Update the PaymentProof with new status and amount
  proof = await paymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send success response
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
};

const deletePaymentProofController = async (req, res) => {
  const { id } = req.params;

  // Find the payment proof by ID
  const proof = await paymentProof.findById(id); // Ensure the correct model name is used
  if (!proof) {
    return res.status(404).send({
      success: false,
      message: "Payment Proof not found",
    });
  }

  // Delete the payment proof
  await proof.deleteOne();

  // Send success response
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
};

const fetchAllUserController = async (req, res) => {
  try {
    // Aggregation pipeline to group users by month, year, and role
    const users = await userModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }, // Corrected year to use $year
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          role: "$_id.role",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    // Filter users by role from the aggregation result
    const bidders = users.filter((user) => user.role === "Bidder");
    const auctioneers = users.filter((user) => user.role === "Auctioneer"); // Ensure correct role spelling

    // Function to transform data into a monthly array
    const transformDataToMonthlyArray = (data, totalMonths = 12) => {
      const result = Array(totalMonths).fill(0);

      data.forEach((item) => {
        result[item.month - 1] = item.count;
      });

      return result;
    };

    // Transform data for bidders and auctioneers
    const biddersArray = transformDataToMonthlyArray(bidders);
    const auctioneersArray = transformDataToMonthlyArray(auctioneers);

    // Send the response
    res.status(200).json({
      success: true,
      biddersArray,
      auctioneersArray,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetchAllUserController API",
      error,
    });
  }
};

const monthlyRevenueController = async (req, res) => {
  try {
    const payments = await commission.aggregate([ // Capitalize Commission
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Function to transform the data into a monthly array
    const transformDataToMonthlyArray = (payments, totalMonths = 12) => {
      const result = Array(totalMonths).fill(0);

      payments.forEach((payment) => {
        result[payment._id.month - 1] = payment.totalAmount;
      });

      return result;
    };

    const totalMonthlyRevenue = transformDataToMonthlyArray(payments);

    // Send response with total monthly revenue
    res.status(200).json({
      success: true,
      totalMonthlyRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in fetching monthly revenue",
      error: error.message,
    });
  }
};


module.exports = { deleteAuctionController, getPaymentProofDetailController, getAllPaymentProofController, updateProofStatusController, deletePaymentProofController,fetchAllUserController,monthlyRevenueController }