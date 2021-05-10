const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const tokenizerController = require('../controllers/tokenizer');

router.post('/tokenize', celebrate({
  body: Joi.object().keys({
    searchReq: Joi.string().required(),
    partnerID: Joi.string().required()
  }),
}), tokenizerController.getTokenizedResult);

module.exports = router;
