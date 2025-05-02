

const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY, JWT_AUTH_EXPIRE_DAYS} = require('../config/envConfig.js');


function getJwtToken(user) {
    const payload = { id : user._id, email : user.email };
    const options = {
        expiresIn : `${JWT_AUTH_EXPIRE_DAYS}d`
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, options);
    return token;
}

function decodeJwtToken(token) {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
}

module.exports = {
    getJwtToken,
    decodeJwtToken,
}