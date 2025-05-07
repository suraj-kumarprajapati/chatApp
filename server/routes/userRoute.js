

const express = require('express');
const { register, login, getUserDetails, getOtherUsers } = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();



router.get('/userDetails', isAuthenticated, getUserDetails);
router.get('/otherUsers', isAuthenticated, getOtherUsers);


module.exports = router;