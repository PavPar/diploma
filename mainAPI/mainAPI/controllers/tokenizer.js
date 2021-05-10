const fetch = require('node-fetch');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');
const {getPartnerCategoriesNoResp} = require('./partner')
const handleError = (err) => {
    if (err.name === 'ValidationError') {
        throw (new ErrorHandler.BadRequestError('Не правильный ID'));
    }

    if (err.name === 'CastError') {
        throw new ErrorHandler.NotFoundError('Партнер не найден');
    }
    console.log(err)
    throw (err);
};

const parseResult = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  };


module.exports.getTokenizedResult = (req, res, next) => {
        getPartnerCategoriesNoResp(req.body.partnerID)
        .then((categories)=>{
            fetch(`${process.env.TOKENIZER_BASEURL}/tokenize`, { headers:{'Content-Type': 'application/json'},method: 'POST', body: JSON.stringify({ categories,"searchReq": req.body.searchReq,categories })})
            .then(parseResult)
            .then((result) => {res.send(result); })
            .catch((err) => handleError(err))
            .catch((err) => next(err));
        })
        .catch((err) => handleError(err))
        .catch((err) => next(err));
};
