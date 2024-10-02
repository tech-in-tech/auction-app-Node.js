const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const auctioneerMiddleware = require('../middleware/auctioneerMiddleware');
const { placeBidController } = require('../controllers/bidController');

// routes
// Get profile || GET
router.post('/placeBid/:id',authMiddleware,placeBidController);


module.exports = router