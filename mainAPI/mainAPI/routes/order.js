const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const orderController = require('../controllers/order');

router.post('/:partnerID/order', celebrate({
    params: Joi.object().keys({
        partnerID: Joi.string().required().min(2).max(30),
    }),
    body: Joi.object().keys({
        order: Joi.array().required()
    }),
}), orderController.addUserOrder);

router.get('/:partnerID/order', celebrate({
    params: Joi.object().keys({
        partnerID: Joi.string().required().min(2).max(30),
    }),
}),orderController.getUserOrders);

module.exports = router;
