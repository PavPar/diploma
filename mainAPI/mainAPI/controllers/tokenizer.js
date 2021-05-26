const fetch = require('node-fetch');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');
const { getPartnerCategoriesNoResp, getPartnerProductsNoResp } = require('./partner')
const fs = require('fs'); //use the file system so we can save files
const handleError = (place = "", err) => {
    if (err.name === 'ValidationError') {
        throw (new ErrorHandler.BadRequestError('Не правильный ID'));
    }

    if (err.name === 'CastError') {
        throw new ErrorHandler.NotFoundError('Партнер не найден');
    }
    console.log(place, err);
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
        .then((categories) => {
            fetch(`${process.env.TOKENIZER_BASEURL}/tokenize`, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ categories, "searchReq": req.body.searchReq, categories }) })
                .then(parseResult)
                .then((result) => { res.send(result); })
                .catch((err) => handleError(err))
                .catch((err) => next(err));
        })
        .catch((err) => handleError(err))
        .catch((err) => next(err));
};


module.exports.getAudioTokenizedResult = (req, res, next) => {
    console.log("hey")
    const { partnerID } = req.body;
    console.log("partnerID", partnerID)
    fetch(`https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${process.env.YC_FOLDERID}&lang=ru-RU`, {
        headers:
        {
            "Authorization": `Api-Key ${process.env.YC_TOKEN}`
        },
        method: 'POST',
        body: fs.createReadStream(req.file.path)
    })
        .then(parseResult)
        .then((result) => {
            console.warn("detected", result)
            getPartnerCategoriesNoResp(partnerID)
                .then((categories) => {
                    fetch(`${process.env.TOKENIZER_BASEURL}/tokenize`,
                        {
                            headers: { 'Content-Type': 'application/json' },
                            method: 'POST',
                            body: JSON.stringify({ categories, "searchReq": result["result"], categories })
                        })
                        .then(parseResult)
                        .then((result) => { res.send(result); })
                        .catch((err) => handleError(err))
                        .catch((err) => next("tokenizer", err));
                })
                .catch((err) => handleError("partner", err))
                .catch((err) => next(err));
            fs.unlinkSync(req.file.path);
        })
        .catch((err) => handleError("YC", err))
        .catch((err) => next(err));

};



module.exports.getItemAlternative = (req, res, next) => {
    fetch(`${process.env.TOKENIZER_BASEURL}/recomenditem`,
        {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ "itemID": req.body.itemID, "partnerID": req.body.partnerID })
        })
        .then(parseResult)
        .then(
            alternativeItems => {
                console.log(alternativeItems)
                getPartnerProductsNoResp(req.body.partnerID)
                    .then(items => {console.log(items); return items.filter(item => {
                        return alternativeItems.some(aItem=>aItem == item._id)
                    })})
                    .then((result) => { res.send(result); })
                    .catch((err) => handleError(err))
                    .catch((err) => next(err))
            }

        )
        .catch((err) => handleError(err))
        .catch((err) => next(err));
};