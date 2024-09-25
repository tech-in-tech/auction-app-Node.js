const  express = require('express');
const { registerController } = require('../controllers/userController');
const router = express.Router()

// routes
// REGISTER || POST
router.post('/register',registerController)

// LOGIN || POST
// router.post('/login',loginController)

module.exports = router