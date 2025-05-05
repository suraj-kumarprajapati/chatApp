

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "chats",
        required : true,
    },

    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        req : true,
    },

    text : {
        type : String,
        required : true,
    },

    read : {
        type : Boolean,
        default : false,
    }
}, {timestamps : true});



const messageModel = mongoose.model('messages', messageSchema);
module.exports = messageModel;


  