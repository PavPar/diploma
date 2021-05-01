/* eslint-disable no-useless-escape */

const mongoose = require('mongoose');

const partnersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('partners', partnersSchema);
