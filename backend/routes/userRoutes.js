const  express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserController, deleteUserController } = require('../controllers/userController');

// routes
// Get profile || GET
router.get('/getUser',authMiddleware,getUserController)
router.delete('/logout/:id',authMiddleware,deleteUserController)


module.exports = router