

const Chat = require('../models/chatModel.js');
const Message = require('../models/messageModel.js');


// create a new chat
const createNewChat = async (req, res) => {
    const members = req.body?.members;

    if(!members || members.length != 2) {
        res.status(400).json({
            success : false,
            message : "Chat can be created only between two users"
        });
        return;
    }

    try {
        const existingChat1 = await Chat.findOne({members : [members[0], members[1]] }).populate('members');

        if(existingChat1 ) {
            res.status(400).json({
                success : false,
                message : "Chat already exists",
                data : existingChat1
            });
            return;
        }


        
        let newChat = await Chat.create({members : members});
        newChat = ((await newChat.populate('members')).populate('lastMessage'));

        res.status(201).json({
            success : true,
            message : `chat created between ${newChat?.members[0]._id} and ${newChat?.members[1]._id}`,
            data : newChat
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            success : false,
            message : error.message,
            error : error
        });
    }
}

// get all chats of currently logged in user
const getAllChats = async (req, res) => {
    const userId = req.body?.id;

    try {
        const allChats = await Chat.find({members : { $in : [userId] }})
                                    .populate('members')
                                    .populate('lastMessage')
                                    .sort({updatedAt : -1});


        res.status(200).json({
            success : true,
            message : "Chats fetched successfully",
            data : allChats
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


// clear unread messages of a chat
const clearUnreadMessages = async (req, res) => {
    const {chatId} = req.body;

    if(!chatId) {
        res.status(400).json({
            success : false,
            message : "ChatId not provided"
        });
        return;
    }

    try {
        const chat = await Chat.findById(chatId);

        if(!chat){
            res.status(400).json({
                message: "No Chat found with given chatId",
                success: false,
            });
            return;
        }

        // update the unread message count in chat collection
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId, 
            {unreadMessageCount : 0 }, 
            {new : true}
        ).populate("members").populate("lastMessage");

        // update the read property to true in message collection
        const updatedMessages = await Message.updateMany({chatId : chatId, read : false}, {read : true} );

        res.status(200).json({
            message: "Unread message cleared successfully",
            success: true,
            data: updatedChat
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



module.exports = {
    createNewChat,
    getAllChats,
    clearUnreadMessages,
}