




const express = require('express');
const { register, login, checkLoginStatus, logout } = require('../controllers/authController.js');
const { isAuthenticated } = require('../middlewares/authMiddleware.js');

const router = express.Router();


router.post('/signup', register);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);



module.exports = router; 