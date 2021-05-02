const router = require('express').Router();

const userRouter = require('./user');
const productsRouter = require('./partner');

router.use(
  userRouter,
  productsRouter,
);

module.exports = router;
