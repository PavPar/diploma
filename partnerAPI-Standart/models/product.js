/* eslint-disable no-useless-escape */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  category_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  manufacturer: {
    type: Object,
    required: true,
  },
  stock: {
    type: Object,
    required: true,
  },
  prices: {
    type: Object,
    required: true,
  },
  prices_per_unit: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model('product', productSchema);
