
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const {PORT} = require('./config/envConfig.js');
const dbConfig = require('./config/dbConfig.js');

const userRoute = require('./routes/userRoute.js');



const app = express(); 



// middlewares
app.use(express.json()); 





// routes
app.use('/api/users', userRoute);



app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});