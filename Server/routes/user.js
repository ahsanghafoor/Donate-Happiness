const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
//Schema
const usermodel = require("../models/userSchema");
const donatebloodmodel = require("../models/donatebloodschema");
const requestbloodmodel = require("../models/requestbloodschema");
const commentmodel = require("../models/commentmodel");
const donationmodel = require("../models/donationschema");
const otp = require("../models/otp");
const router = express.Router();

//User Signup API
router.post("/signup", async (req, res) => {
  const { FirstName, LastName, email, password, cpassword } = req.body;
  // console.log(email)
  if (!FirstName || !LastName || !email || !password || !cpassword) {
    res.status(400).send("please Fill all the above fields!");
  }
  try {
    const userExist = await usermodel.findOne({ email: email });
    if (userExist) {
      res.send("Already registered with this Email, Please enter valid Email");
    } else if (password != cpassword) {
      res.send("Passwords do not match!");
    } else {
      const userData = await usermodel({
        FirstName,
        LastName,
        email,
        password,
        cpassword,
      });
      //password hash
      await userData.save();
      res.send("Account Created sucsessfully");
    }
  } catch (err) {
    res.send(err);
  }
});

// //signin
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Please enter Username and Password");
    }
    const userlogin = await usermodel.findOne({ email: email });
    // console.log(useremail);
    if (userlogin) {
      const ismatch = await bcrypt.compare(password, userlogin.password);
      token = await userlogin.generateAuthToken();
      // console.log(token);
      res.cookie("jwt-token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true,
      });
    }
    if (!userlogin) {
      return res.send("Invalid credentials!");
    } else {
      return res.send("Great! User Login sucsessfully");
    }
  } catch (err) {
    res.send(err);
  }
});

//donate Blood form
router.post("/donate-blood", async (req, res) => {
  const {
    userID,
    fullname,
    cnic,
    bloodtype,
    city,
    donorage,
    contactno,
    donoraddress,
  } = req.body;
  // console.log(req.body)
  if (
    !userID ||
    !fullname ||
    !cnic ||
    !bloodtype ||
    !city ||
    !donorage ||
    !contactno ||
    !donoraddress
  ) {
    res.status(400).send("please Fill all the above fields!");
  }
  try {
    const postdata = await donatebloodmodel({
      userID,
      fullname,
      cnic,
      bloodtype,
      city,
      donorage,
      contactno,
      donoraddress,
    });
    await postdata.save();
    const postexist = await donatebloodmodel.find({ userID: userID });
    if (postexist) {
      res.send(postexist);
    } else {
      res.send("Post not found");
    }
  } catch (err) {
    res.send(err);
  }
});
//Request Blood Form
router.post("/requestblood", async (req, res) => {
  const {
    userID,
    fullname,
    cnic,
    bloodtype,
    city,
    requesterage,
    contactno,
    requesteraddress,
  } = req.body;
  if (
    !userID ||
    !fullname ||
    !cnic ||
    !bloodtype ||
    !city ||
    !requesterage ||
    !contactno ||
    !requesteraddress
  ) {
    res.status(400).send("please Fill all the above fields!");
  }
  try {
    const postdata = await requestbloodmodel({
      userID,
      fullname,
      cnic,
      bloodtype,
      city,
      requesterage,
      contactno,
      requesteraddress,
    });
    await postdata.save();
    const postexist = await requestbloodmodel.find({ userID: userID });
    if (postexist) {
      res.send(postexist);
    } else {
      res.send("Post not found");
    }
  } catch (err) {
    res.send(err);
  }
});

// Comment api
router.post("/comment", async (req, res) => {
  const { userID, firstname, lastname, email, comment } = req.body;
  if (!userID || !firstname || !lastname || !email || !comment) {
    res.status(400).send("please Fill all the above fields!");
  }
  try {
    const commentdata = await commentmodel({
      userID,
      firstname,
      lastname,
      email,
      comment,
    });
    await commentdata.save();
    const commentexist = await commentmodel.find({ userID: userID });
    if (commentexist) {
      res.send(commentexist);
    } else {
      res.send("Post not found");
    }
  } catch (err) {
    res.send(err);
  }
});
//donation
router.post("/donation", async (req, res) => {
  const { name, nameapear, donationamount, cvv, cardno } = req.body;
  if (!name || !nameapear || !donationamount || !cvv || !cardno) {
    res.status(400).send("please Fill all the above fields!");
  }
  try {
    const donation = await donationmodel({
      name,
      nameapear,
      donationamount,
      cvv,
      cardno,
    });
    await donation.save();
    res.send("Thanks for your donation");
  } catch (err) {
    res.send(err);
  }
});

router.post("/email-send", async (req, res) => {
  const { email } = req.body;
  let data = await usermodel.findOne({ email: email });
  const responcetype = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 10000 + 1);
    let otpdata = new otp({
      email: email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    let otpresponce = await otpdata.save();
    responcetype.statusText = "success";
    responcetype.message = "Please check your Email Address";
    mailer(email, otpcode);
  } else {
    responcetype.statusText = "Error";
    responcetype.message = "Please Enter a valid email address";
  }
  res.status(200).json(responcetype);
});
//change password
router.post("/change-password", async (req, res) => {
  let data = await otp.find({ email: req.body.email, code: req.body.otpcode });
  const responce = {};
  if (data) {
    let currenttime = new Date().getTime();
    let diff = data.expireIn - currenttime;
    if (diff < 0) {
      responce.message = "Token expired";
      responce.status = "Error";
    } else {
      let user = await usermodel.findOne({ email: req.body.email });
      user.password = req.body.password;
      user.save();
      responce.message = "Password changed";
      responce.status = "Success";
    }
  } else {
    responce.message = "Invalid otp";
    responce.status = "Error";
  }
  res.status(200).json(responce);
});

const mailer = (email, otp) => {
  //links.....
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    // secure: false,
    auth: {
      user: "029515ahsanghafoor@gmail.com",
      pass: "vjmhkcokjeviqebg",
    },
  });
  var mailoptions = {
    from: "029515ahsanghafoor@gmail.com",
    to: email,
    subject: "Reset Your Password At Donate Happiness",
    html: `Your Otp for Reset Password : ${otp}`,
  };
  transporter.sendMail(mailoptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent :" + info.response);
    }
  });
};

//Charity Sum:
router.get("/charitySum", async (req, res) => {
  const totalamount = await donationmodel.aggregate([
    {
      $group: {
        _id: null,
        donationamount: { $sum: "$donationamount" },
      },
    },
  ]);
  // console.log(totalamount);
  res.status(200).send(totalamount);
});
module.exports = router;
// export default router (new method)
