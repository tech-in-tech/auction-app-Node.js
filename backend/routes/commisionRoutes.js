const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const auctioneerMiddleware = require('../middleware/auctioneerMiddleware');
const checkAuctionTimeMiddleware = require('../middleware/checkAuctionTimeMiddleware');
const { proofOfCommission } = require('../controllers/commisionController');

// routes
// Get profile || GET
router.post('/proof/',authMiddleware,auctioneerMiddleware,proofOfCommission);


module.exports = router