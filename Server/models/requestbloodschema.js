const mongoose = require('mongoose');

const RequestBloodSchema = new mongoose.Schema({
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
    requesterage: {
        type: Number,
        required: true,
    },
    contactno: {
        type: Number,
        required: true,
    },
    requesteraddress: {
        type: String,
        required: true,
    },
});

const requestbloodmodel = mongoose.model("requestblood", RequestBloodSchema);
module.exports = requestbloodmodel;