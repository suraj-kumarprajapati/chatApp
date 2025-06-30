const User = require('../models/userModel.js');
const cloudinary = require('../config/cloudinaryConfig.js');
const {CLOUDINARY_FOLDER_NAME} = require('../config/envConfig.js');







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


const uploadProfilePic = async (req, res) => {

    const {id : userId, image} = req.body;
   
    if(!image) {
        res.status(400).json({
            success : false,
            message : "Profile Image Not Provided",
        });
        return;
    }

    try {

        // upload the image to the cloudinary first
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder : CLOUDINARY_FOLDER_NAME,
        });

        // save the url to the mongodb db
        const updatedUser = await User.findByIdAndUpdate({_id : userId}, 
            {profilePic : uploadedImage.secure_url}, 
            {new : true}
        );


        res.status(200).json({
            success : true,
            message : "Profile Pic Updated Successfully",
            data : updatedUser,
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
    getUserDetails,
    getOtherUsers,
    uploadProfilePic,
}