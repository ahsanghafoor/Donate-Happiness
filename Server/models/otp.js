const mongoose = require("mongoose");
// const conn = require('../models/userSchema')

const optschema = new mongoose.Schema(
  {
    email: String,
    code: String,
    expireIn: Number,
  },
  {
    timestamps: true,
  }
);

let otpmodel = mongoose.model("otp", optschema);
module.exports = otpmodel;
