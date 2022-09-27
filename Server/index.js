const express = require("express");
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DonateHappiness');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
//for connectivity of JSON
app.use(express.json())
const user = require('./routes/user')
const admin = require('./routes/admin')
//auth file connectvity with index.js
app.use(require('./routes/user'));
app.use(require('./routes/admin'));



app.listen(3001, () => {
    console.log("Server started at 3001");
});
