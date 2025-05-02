

const mongoose = require('mongoose');
const {DB_URL }= require('./envConfig.js');


// connect to db
mongoose.connect(DB_URL);

// connection state
const db = mongoose.connection;

db.on('connected', () => console.log('DB connected'));
db.on('err', () => console.log('DB connection failed'));
db.on('disconnected', () => console.log('DB disconnected'));


module.exports = db;
