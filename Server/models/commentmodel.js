const mongoose = require('mongoose');
const { estimatedDocumentCount } = require('./donatebloodschema');

const commentschema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

const commentmodel = mongoose.model('Comment', commentschema);
module.exports = commentmodel;