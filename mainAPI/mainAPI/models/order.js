const { required } = require('joi');
const mongoose = require('mongoose');

const orderShema = new mongoose.Schema({
    partnerID: {
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    },
    order:{
        type: Array,
        required: true,
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('order', orderShema);
