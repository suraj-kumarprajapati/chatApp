
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const {PORT} = require('./config/envConfig.js');
const dbConfig = require('./config/dbConfig.js');



const app = express(); 



// middlewares
app.use(express.json()); 





// routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});