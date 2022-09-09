const express = require('express');
// const { findOne } = require('../models/user');
const router = express.Router();

// router.post("/signup", async(req, res) => {
//     const { FirstName, LastName, email, password, cpassword } = req.body;
//     console.log(email)
//     if (!FirstName || !LastName || !email || !password || !cpassword) {
//         res.status(400).send('please Fill all the above fields!')
//     }
//     try {
//         const userExist = await usermodel.findOne({ email: email })
//         if (userExist) {
//             res.send('Already registered with this Email, Please enter valid Email');
//         } else {
//             const userData = await usermodel({ FirstName, LastName, email, password, cpassword })
//             await userData.save()
//             res.send('Account Created sucsessfully')
//         }
//     } catch (err) {
//         res.send(err)
//     }
// });

// router.post('/signin', async(req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             res.status(400).send('Please enter complete information');
//         }
//         const usermail = await usermodel.findOne({ email: email });
//         console.log(email);
//         if (usermail) {
//             return res.send('Great! User created Successfully');
//         } else {
//             return res.send('user not exsist');
//         }
//     } catch (err) {
//         res.send(err);
//     }
// });
module.exports = router;