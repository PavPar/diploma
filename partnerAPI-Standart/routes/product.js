/* eslint-disable arrow-parens */
const router = require('express').Router();

const productController = require('../controllers/product');

router.get('/products', productController.getAllProducts);

module.exports = router;
