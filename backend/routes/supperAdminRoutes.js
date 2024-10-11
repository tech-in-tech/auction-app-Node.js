const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const auctioneerMiddleware = require('../middleware/auctioneerMiddleware');
const checkAuctionTimeMiddleware = require('../middleware/checkAuctionTimeMiddleware');
const { deleteAuctionController, getAllPaymentProofController, getPaymentProofDetailController, updateProofStatusController, deletePaymentProofController, fetchAllUserController, monthlyRevenueController } = require('../controllers/supperAdminController');


// routes
// Get profile || GET
router.delete('/auctionItem/delete/:id',authMiddleware,deleteAuctionController);

router.get('/paymentProofs/getAll',authMiddleware,getAllPaymentProofController);

router.get('/paymentProof/:id',authMiddleware,getPaymentProofDetailController);

router.put('/paymentProof/status/update/:id',authMiddleware,updateProofStatusController);

router.delete('/paymentProof/delete/:id',authMiddleware,deletePaymentProofController);

router.get('/users/getAll',authMiddleware,fetchAllUserController);
router.get('/monthlyIncome',authMiddleware,monthlyRevenueController);


module.exports = router