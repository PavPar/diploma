const router = require('express').Router();

const userRouter = require('./user');
const productsRouter = require('./products');

router.use(
  userRouter,
  productsRouter,
);

module.exports = router;
