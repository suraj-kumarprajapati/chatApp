


const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { createNewChat, getAllChats } = require('../controllers/chatController');
const router = express.Router();

router.post("/newChat", isAuthenticated, createNewChat);
router.get("/allChats", isAuthenticated, getAllChats);


module.exports = router;