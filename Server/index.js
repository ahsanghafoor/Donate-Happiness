const dotenv = require('dotenv')
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const usermodel = require('./models/userSchema');
mongoose.connect('mongodb://localhost:27017/DonateHappiness');
dotenv.config({ path: './config.env' });
//for connectivity of JSON
app.use(express.json())
//auth file connectvity with index.js
// app.use(require('./router/auth'));
//Signup API
app.post("/signup", async(req, res) => {
    const { FirstName, LastName, email, password, cpassword } = req.body;
    console.log(email)
    if (!FirstName || !LastName || !email || !password || !cpassword) {
        res.status(400).send('please Fill all the above fields!')
    }
    try {
        const userExist = await usermodel.findOne({ email: email })
        if (userExist) {
            res.send('Already registered with this Email, Please enter valid Email');
        } else if(password != cpassword) {
            res.send('Passwords do not match!')}
            else {
            const userData = await usermodel({ FirstName, LastName, email, password, cpassword })
            //password hash
            await userData.save()
            res.send('Account Created sucsessfully')
        }
    } catch (err) {
       res.send(err)
    }
});
// //signin
app.post("/signin", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send('Please enter Username and Password')
        }
        const useremail = await usermodel.findOne({ email: email, password: password });
        console.log(useremail);
        if (useremail) {
            return res.send('Great! User Login sucsessfully')
        } else {
            return res.send('User not exist')
        }
    } catch (err) {
        res.send(err)
    }
});


app.listen(3001, () => {
    console.log("Server is listening on port ");
});