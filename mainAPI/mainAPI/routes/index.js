const router = require('express').Router();

const userRouter = require('./user');
const productsRouter = require('./partner');
const orderRouter = require('./order');
const tokenizerRouter = require('./tokenizer')
router.use(
  userRouter,
  productsRouter,
  orderRouter,
  tokenizerRouter
);

module.exports = router;
