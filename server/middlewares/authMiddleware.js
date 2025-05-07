const jwtImpl = require('../utils/jwtImpl.js');

function isAuthenticated(req, res, next) {
    const {jwtToken} = req.cookies;

    if (!jwtToken) {
        res.status(401).json({
            success: false,
            message: "user is not logged in",
        });
        return;
    }

    try {
        // {id : user._id, email : user.email}
        const decodedToken = jwtImpl.decodeJwtToken(jwtToken);

        const expDate = decodedToken?.exp;

        if(!decodedToken || Date.now() >= expDate * 1000 ) {
            res.status(401).json({
                success: false,
                message: "user is not logged in",
            });
            return;
        }

    
        // sed user id in req.body
        req.body.id = decodedToken.id;

        // call next middleware/controller
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Authentication failed",
            error: error
        });
    }
}

module.exports = {
    isAuthenticated,
}

