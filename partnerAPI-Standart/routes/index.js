const router = require('express').Router();

const productsRouter = require('./product');
const categoryRouter = require('./category');

router.use(
  productsRouter,
  categoryRouter,
);

module.exports = router;
