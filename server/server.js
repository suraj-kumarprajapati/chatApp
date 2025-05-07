
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');


const {PORT} = require('./config/envConfig.js');
const dbConfig = require('./config/dbConfig.js');

const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js');
const chatRoute = require('./routes/chatRoute.js');
const messageRoute = require('./routes/messageRoute.js');



const app = express(); 



// middlewares
app.use(express.json()); 
app.use(cookieParser());






// routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);



app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});