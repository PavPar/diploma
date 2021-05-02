/* eslint-disable arrow-parens */
const router = require('express').Router();

const categoryController = require('../controllers/category');

router.get('/categories', categoryController.getAllCategories);

module.exports = router;
