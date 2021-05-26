const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');

const handleError = (err) => {
  if (err.name === 'ValidationError') {
    throw (new ErrorHandler.BadRequestError('Запрос неккоректен'));
  }

  if (err.name === 'CastError') {
    throw new ErrorHandler.NotFoundError('Подукты не найдены');
  }

  throw (err);
};

module.exports.getAllProducts = (req, res, next) => {
  Product.find({})
    .orFail(() => { throw new ErrorHandler.NotFoundError('Подукты не найдены'); })
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.getProductByCategory = (req, res, next) => {
  Product.find({ category_id: req.params.categoryID })
    .orFail(() => { throw new ErrorHandler.NotFoundError('Подукты не найдены'); })
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};


module.exports.getProductByID = (req, res, next) => {
  Product.find({ _id: req.params.productID })
    .orFail(() => { throw new ErrorHandler.NotFoundError('Подукты не найдены'); })
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};