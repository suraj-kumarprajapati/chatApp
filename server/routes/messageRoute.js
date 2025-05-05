




const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { sendMessage, getAllMessages } = require('../controllers/messageController');
const router = express.Router();

router.post("/newMessage", isAuthenticated, sendMessage);
router.get("/allMessages/:chatId", isAuthenticated, getAllMessages);


module  .exports = router;