

const Chat = require('../models/chatModel.js');


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
        newChat = await newChat.populate('members');

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
        const allChats = await Chat.find({members : { $in : [userId] }}).populate('members').sort({updatedAt : -1});


        res.status(200).json({
            success : true,
            message : "Chats fetched successfully",
            data : allChats
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



module.exports = {
    createNewChat,
    getAllChats,
}