const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const auctioneerMiddleware = require("../middleware/auctioneerMiddleware");
const { addNewAuctionItem, getAllAuctionItems, getSingleAuction, getMyAuctionItem } = require('../controllers/auctionController');

// routes
// Get profile || GET
router.post('/addAuction',authMiddleware,auctioneerMiddleware, addNewAuctionItem)
router.get('/getAllAuctionItems', getAllAuctionItems)
router.get('/getSingleAuction/:id',authMiddleware,getSingleAuction)
router.get('/getMyAuction',authMiddleware,auctioneerMiddleware,getMyAuctionItem)



module.exports = router