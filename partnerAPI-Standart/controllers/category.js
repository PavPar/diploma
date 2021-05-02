const Category = require('../models/category');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');

const handleError = (err) => {
  if (err.name === 'ValidationError') {
    throw (new ErrorHandler.BadRequestError('Запрос неккоректен'));
  }

  if (err.name === 'CastError') {
    throw new ErrorHandler.NotFoundError('Категории не найдены');
  }

  throw (err);
};

module.exports.getAllCategories = (req, res, next) => {
  Category.find({})
    .orFail(() => { throw new ErrorHandler.NotFoundError('Категории не найдены'); })
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};
