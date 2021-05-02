/* eslint-disable no-useless-escape */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  keywords: {
    type: Array,
    required: true,
  },
  vendorlist: {
    type: Array,
    required: true,
  },

});

module.exports = mongoose.model('category', categorySchema);
