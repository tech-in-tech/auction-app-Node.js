const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserController, deleteUserController, fetchLeaderboardController, updateUserPasswordController } = require('../controllers/userController');

// routes
// Get profile || GET
router.get('/getUser',authMiddleware,getUserController)
router.delete('/logout/:id',authMiddleware,deleteUserController)
router.get('/leaderBoard',authMiddleware,fetchLeaderboardController);
router.post('/updateUserPassword',authMiddleware,updateUserPasswordController);


module.exports = router