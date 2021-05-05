const fetch = require('node-fetch');
const Partner = require('../models/partner');
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

// module.exports.getPartnerProducts = (req, res, next) => {
//   Partner.findById(req.params.partnerID)
//     .orFail(() => { throw new ErrorHandler.NotFoundError('Партнер не найден'); })
//     .then((partnerData) => fetch(`${partnerData.baseUrl}/tokenize`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         searchReq: ' 3 хлеба гербер',
//       }),
//     }))
//     .then(parseResult)
//     .then((result) => { res.send(result); })
//     .catch((err) => handleError(err))
//     .catch((err) => next(err));
// };

module.exports.getAllPartners = (req, res, next) => {
  Partner.find({})
    .orFail(() => { throw new ErrorHandler.NotFoundError('Партнер не найден'); })
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.getPartnerProducts = (req, res, next) => {
  Partner.findById(req.params.partnerID)
    .orFail(() => { throw new ErrorHandler.NotFoundError('Партнер не найден'); })
    .then((partnerData) => fetch(`${partnerData.baseUrl}/products`, {
      method: 'GET',
    }))
    .then(parseResult)
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.getPartnerCategories = (req, res, next) => {
  Partner.findById(req.params.partnerID)
    .orFail(() => { throw new ErrorHandler.NotFoundError('Партнер не найден'); })
    .then((partnerData) => fetch(`${partnerData.baseUrl}/categories`, {
      method: 'GET',
    }))
    .then(parseResult)
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.getPartnerProductByCategory = (req,res,next) =>{
  Partner.findById(req.params.partnerID)
    .orFail(() => { throw new ErrorHandler.NotFoundError('Партнер не найден'); })
    .then((partnerData) => fetch(`${partnerData.baseUrl}/products/${req.params.categoryID}`, {
      method: 'GET',
    }))
    .then(parseResult)
    .then((result) => { res.send(result); })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
}
