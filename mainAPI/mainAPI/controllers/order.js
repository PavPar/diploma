const fetch = require('node-fetch');
const Order = require('../models/order');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');

const handleError = (err) => {
    if (err.name === 'ValidationError') {
        throw (new ErrorHandler.BadRequestError('Не правильный ID'));
    }

    if (err.name === 'CastError') {
        throw new ErrorHandler.NotFoundError('Партнер не найден');
    }

    throw (err);
};

const parseResult = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(res.status);
};

module.exports.getUserOrders = (req, res, next) => {
    Order.findById(req.params.user._id)
        .orFail(() => { throw new ErrorHandler.NotFoundError('Заказов не найдено'); })
        .then((result) => { res.send(result); })
        .catch((err) => handleError(err))
        .catch((err) => next(err));
};

module.exports.addUserOrder = (req, res, next) => {
    const { order } = req.body
    const { partnerID } = req.params
    const userID = req.user._id
    Order.create({ partnerID, userID, order })
        .then((orders) => {
            res.send(orders);
        })
        .catch((err) => handleError(err))
        .catch((err) => next(err));
};