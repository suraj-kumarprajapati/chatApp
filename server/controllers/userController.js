const User = require('../models/userModel.js');







// user functionality controllers

// get current user details
const getUserDetails = async (req, res) => {
    const userId = req.body.id;

    try {
        const user = await User.findOne({_id : userId}).select("-password");

        res.status(200).json({
            success : true,
            message : "user details fetched successfully",
            data : user
        })
    }
    catch(error) {
        res.status(400).json({
            success : false,
            message : error.message,
            error : error
        });
    }
}

// get all other users details except current user
const getOtherUsers = async (req, res) => {
    const userId = req.body.id;

    try {
        const allUsers = await User.find({_id : {$ne : userId}}).select("-password");

        res.status(200).json({
            success : true,
            message : "All other users fetched successfully",
            data : allUsers
        })
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
    getUserDetails,
    getOtherUsers,
}