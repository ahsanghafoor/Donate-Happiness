const mongoose = require('mongoose');

const donationschema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    nameapear:{
        type: String,
        required: true,
    },
    donationamount:{
        type: Number,
        required: true,
    },
    cvv:{
        type: Number,
        required: true,
    },
    cardno:{
        type: Number,
        required: true,
    },
});

const donationmodel = mongoose.model('donation',donationschema);
module.exports = donationmodel;