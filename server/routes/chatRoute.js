


const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { createNewChat, getAllChats, clearUnreadMessages } = require('../controllers/chatController');
const router = express.Router();

router.post("/newChat", isAuthenticated, createNewChat);
router.get("/allChats", isAuthenticated, getAllChats);
router.post("/clear-unread-messages", isAuthenticated, clearUnreadMessages);


module.exports = router;