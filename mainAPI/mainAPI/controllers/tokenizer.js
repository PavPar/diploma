const fetch = require('node-fetch');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');
const { getPartnerCategoriesNoResp } = require('./partner')
const fs = require('fs'); //use the file system so we can save files
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

const fileToBuffer = (filename, cb) => {
    let readStream = fs.createReadStream(filename);
    let chunks = [];

    // Handle any errors while reading
    readStream.on('error', err => {
        // handle error

        // File could not be read
        return cb(err);
    });

    // Listen for data
    readStream.on('data', chunk => {
        chunks.push(chunk);
    });

    // File is done being read
    readStream.on('close', () => {
        // Create a buffer of the image from the stream
        return cb(null, Buffer.concat(chunks));
    });
}



module.exports.getAudioTokenizedResult = (req, res, next) => {
    fetch(`https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=b1gv3fl0m0isefc69r5m&lang=ru-RU`, {
        headers:
        {
            "Authorization": `Bearer t1.9euelZqMipuWnYzKj4mOiouKlsuXju3rnpWamMmdjZHPj5mTzYqSkZSLipXl8_d3VXB6-e8zE3w1_N3z9zcEbnr57zMTfDX8.lJCISLd3Tq3_UimldxcX4YkjjBrP_oV0qkuLu22wAIGrj-kNKkO6TJAGIN-oXFqCNH1YgbYMA839j-HINkahBg`
        },
        method: 'POST',
        body: fs.createReadStream(req.file.path)
    })
        .then(parseResult)
        .then((result) => { res.send(result); })
        .catch((err) => handleError(err))
        .catch((err) => next(err));

};