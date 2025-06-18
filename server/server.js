
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
const cors = require('cors');


const app = express(); 



// middlewares
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));


app.use(express.json()); 
app.use(cookieParser());



// socket io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors : {
        origin : 'http://localhost:5173',
        methods : ['GET', 'POST', 'PUT', 'DELETE']
    }
})



// routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);


// test socket connection and handle socket events from client
io.on('connection', socket => {
    console.log('connection with socket id : ' + socket.id);

    socket.on('join-room', userId => {
        socket.join(userId);
    });

    socket.on("send-message", message => {
        io.to(message.members[0])
            .to(message.members[1])
            .emit('receive-message', message);
    })
})



// lister to server at PORT
server.listen(PORT, () => {
    console.log('Server is running on port', PORT); 
});