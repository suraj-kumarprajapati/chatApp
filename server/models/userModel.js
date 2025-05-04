

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },

    lastName : {
        type : String,
        required : true,
    },

    email : {
        type : String,
        required : true,
    },

    password : {
        type : String,
        required : true,
        select : false,
        minLength : 8,
    },

    profilePic : {
        type : String,
        required : false,
    }
}, {timestamps : true});



const userModel = mongoose.model('users', userSchema);
module.exports = userModel;


