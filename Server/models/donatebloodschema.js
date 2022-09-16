const mongoose = require('mongoose');

const DonateBloodSchema = new mongoose.Schema({
    userID : {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    cnic: {
        type: Number,
        required: true,
    },
    bloodtype: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    donorage: {
        type: Number,
        required: true,
    },
    contactno: {
        type: Number,
        required: true,
    },
    donoraddress: {
        type: String,
        required: true,
    },
});

const donatebloodmodel = mongoose.model("donateblood", DonateBloodSchema);
module.exports = donatebloodmodel;