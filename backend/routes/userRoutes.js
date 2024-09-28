const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserController, deleteUserController, fetchLeaderboardController } = require('../controllers/userController');

// routes
// Get profile || GET
router.get('/getUser',authMiddleware,getUserController)
router.delete('/logout/:id',authMiddleware,deleteUserController)
router.get('/leaderBoard',authMiddleware,fetchLeaderboardController);


module.exports = router