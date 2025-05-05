

const Chat = require('../models/chatModel.js');
const Message = require('../models/messageModel.js');


// send message
const sendMessage = async (req, res) => {
    const {chatId, sender, text} = req.body;

    if(!chatId || !sender || !text)  {
        res.status(400).json({
            success : false,
            message : "message could not be sent",
        });
        return;
    }

    try {
        // check the chatId and sender are valid
        const chat = await Chat.findOne({_id : chatId});

        if( ( chat?.members[0].toString() !== sender && chat?.members[1].toString() !== sender ) || sender !== req.body?.id) {
            res.status(400).json({
                success : false,
                message : 'Invalid Chat or Sender',
            });
            return;
        }

        // save the message in the db
        const newMessage = await Message.create({
            chatId : chatId,
            sender : sender,
            text : text,
        });

        // update this Chat's lastMessage and unreadMessageCount
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            lastMessage : newMessage._id,
            $inc : {unreadMessageCount : 1}
        });

        res.status(201).json({
            success : true,
            message : 'message sent successfully'
        });
    }
    catch(error) {
        res.status(400).json({
            success : false,
            message : error.message,
            error : error
        });
    }
}


// get all messages for a chat
const getAllMessages = async (req, res) => {
    const chatId = req.params?.chatId;

    if(!chatId) {
        res.status(400).json({
            success : false,
            message : "Invalid chat",
        });
        return;
    }

    try {
        // sort the messages in asending order(1)
        const messages = await Message.find({chatId : chatId}).sort({createdAt : 1});

        res.status(200).json({
            success : true,
            message : "messages fetched successfully",
            data : messages
        });        
    }
    catch (error) {
        res.status(400).json({
            success : false,
            message : error.message,
            error : error
        });
    }
}


module.exports = {
    sendMessage,
    getAllMessages,
}