const jwtImpl = require('../utils/jwtImpl.js');

function isAuthenticated(req, res, next) {
    const jwtToken = req.headers?.authorization?.split(' ')[1];

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

        if(!decodedToken) {
            res.status(401).json({
                success: false,
                message: "user is not logged in",
            });
            return;
        }

        // check the expiry token condition



        req.body.id = decodedToken.id;

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

