const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
//Schema
const usermodel = require('../models/userSchema');
const donatebloodmodel = require('../models/donatebloodschema');
const commentmodel = require('../models/commentmodel');
const router = express.Router();

//User Signup API
router.post("/signup", async(req, res) => {
    const { FirstName, LastName, email, password, cpassword } = req.body;
    // console.log(email)
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
router.post("/signin", async(req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send('Please enter Username and Password')
        }
        const userlogin = await usermodel.findOne({ email: email });
        // console.log(useremail);
        if (userlogin){
            const ismatch = await bcrypt.compare(password, userlogin.password);
            token = await userlogin.generateAuthToken();
            // console.log(token);
            res.cookie("jwt-token", token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                httpOnly: true
            });
        }
        if (!userlogin) {
            return res.send('Invalid credentials!')
        }else{
            return res.send('Great! User Login sucsessfully')
        }
    } catch (err) {
        res.send(err)
    }
});

//donate Blood form
router.post('/donate-blood', async (req, res) => {
        const {userID, fullname, cnic, bloodtype, city, donorage, contactno, donoraddress } = req.body;
        // console.log(req.body)
        if(!userID|| !fullname || !cnic || !bloodtype || !city || !donorage || !contactno || !donoraddress) {
            res.status(400).send('please Fill all the above fields!');
        }
        try{
            const postdata = await donatebloodmodel({userID, fullname, cnic, bloodtype, city, donorage, contactno, donoraddress})
            await postdata.save();
            const postexist = await donatebloodmodel.find({"userID" : userID})
            if(postexist){
                res.send(postexist)
            }else{
                res.send("Post not found")
            }
        }
    catch (err) {
        res.send(err)
    }
});

// Comment api
router.post('/comment', async (req, res) => {
    const { userID, firstname, lastname, email, comment } = req.body;
    if( !userID || !firstname || !lastname || !email || !comment ){
        res.status(400).send('please Fill all the above fields!');
    }
    try{
        const commentdata = await commentmodel({userID, firstname, lastname, email, comment})
        await commentdata.save();
        const commentexist = await commentmodel.find({"userID" : userID})
        if(commentexist){
            res.send(commentexist)
            }else{
                res.send("Post not found")
                }
                }
    catch (err) {
        res.send(err)
        }
    });

module.exports = router;
// export default router (new method)