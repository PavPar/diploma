/* eslint-disable arrow-parens */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const partnerController = require('../controllers/partner');

// router.get('/:partnerID/products', celebrate({
//   params: Joi.object().keys({
//     partnerID: Joi.string().required().min(2).max(30),
//   }),
// }), partnerController.getPartnerProducts);

router.get('/:partnerID/categories', celebrate({
  params: Joi.object().keys({
    partnerID: Joi.string().required().min(2).max(30),
  }),
}), partnerController.getPartnerCategories);

router.get('/partners', partnerController.getAllPartners);

router.get('/:partnerID/products/:categoryID', celebrate({
  params: Joi.object().keys({
    partnerID: Joi.string().required().min(2).max(30),
    categoryID: Joi.string().required().min(2).max(30),
  }),
}), partnerController.getPartnerProductByCategory);


module.exports = router;
