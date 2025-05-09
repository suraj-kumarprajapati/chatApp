
const User = require('../models/userModel.js');
const bcryptImpl = require('../utils/bcryptImpl.js');
const jwtImpl = require('../utils/jwtImpl.js');
const {JWT_AUTH_EXPIRE_DAYS} = require('../config/envConfig.js');






// auth controllers
const register = async (req, res) => {

    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password) {
        res.status(400).json({
            success : false,
            message : "Fields can not be empty",
        });
        return;
    }

    try {

        // check if the user already exists
        const existingUser = await User.findOne({ email : email }).select("-password");
        
        if(existingUser) {
            res.status(400).json({
                success : false,
                message : "User already exists",
            })
            return;
        }


        // encrypt the password 
        const hashedPassword = await bcryptImpl.encryptPassword(password);

        const createdUser = await User.create({
            firstName : firstName,
            lastName : lastName, 
            email : email,
            password : hashedPassword
        });
        

        res.status(201).json({
            success : true,
            message : "Registeration successfull",
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



const login = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400).json({
            success : false,
            message : "Fields can not be empty",
        });
        return;
    }

    try {

        // check if the user exists or not
        const existingUser = await User.findOne({ email : email }).select("+password");
        
        if(!existingUser) {
            res.status(400).json({
                success : false,
                message : "User does not exist! Invalid email",
            })
            return;
        }


        // check if the password is correct or not
        const doesPasswordMatch = await bcryptImpl.matchPassword(password, existingUser.password);

        if(!doesPasswordMatch) {
            res.status(401).json({
                success : false,
                message : "Invalid password",
            });
            return;
        }


        // create jwt token for authentication purpose
        const jwtToken = jwtImpl.getJwtToken(existingUser);
        
        const options = {
            expires : new Date(Date.now() + (Number(JWT_AUTH_EXPIRE_DAYS)*24*60*60*1000)),
            httpOnly : true,
        }

        res.cookie("jwtToken", jwtToken, options);

        res.status(201).json({
            success : true,
            message : "Login successfull",
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



// also add logout method




module.exports = {
    register,
    login,
}