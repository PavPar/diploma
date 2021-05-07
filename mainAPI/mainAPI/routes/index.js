const router = require('express').Router();

const userRouter = require('./user');
const productsRouter = require('./partner');
const orderRouter = require('./order');

router.use(
  userRouter,
  productsRouter,
  orderRouter,
);

module.exports = router;
