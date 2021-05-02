/* eslint-disable arrow-parens */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const partnerController = require('../controllers/partner');

router.get('/:partnerID/products', celebrate({
  params: Joi.object().keys({
    partnerID: Joi.string().required().min(2).max(30),
  }),
}), partnerController.getPartnerProducts);

router.get('/partners', partnerController.getAllPartners);

module.exports = router;
