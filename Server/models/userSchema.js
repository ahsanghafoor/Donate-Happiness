const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userschema = new mongoose.Schema({
  FirstName: {
    type: String,
    require: true,
  },
  LastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

//password hash
userschema.pre("save", async function (next) {
  console.log("hi from server");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});
//Generating Token using JWT
userschema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.sercret_key);
    this.token = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

//colllection creation for user signup
const usermodel = mongoose.model("user", userschema);
module.exports = usermodel;
