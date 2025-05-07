




const express = require('express');
const { register, login, checkLoginStatus } = require('../controllers/authController.js');

const router = express.Router();


router.post('/signup', register);
router.post('/login', login);
router.post('/loginStatus', checkLoginStatus);



module.exports = router; 