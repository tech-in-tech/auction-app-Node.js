const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addNewAuctionItem } = require('../controllers/auctionController');

// routes
// Get profile || GET
router.post('/addAuction',authMiddleware,addNewAuctionItem)



module.exports = router