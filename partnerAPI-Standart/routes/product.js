/* eslint-disable arrow-parens */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const productController = require('../controllers/product');

router.get('/products', productController.getAllProducts);

router.get('/products/:categoryID', celebrate({
    params: Joi.object().keys({
      categoryID: Joi.string().required().min(2).max(30),
    }),
}), productController.getProductByCategory);

module.exports = router;
