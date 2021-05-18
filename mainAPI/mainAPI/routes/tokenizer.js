const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const tokenizerController = require('../controllers/tokenizer');
const multer  = require('multer');

const upload = multer({ dest: __dirname + '/public/uploads/' });
const type = upload.single('upl');

router.post('/tokenize', celebrate({
  body: Joi.object().keys({
    searchReq: Joi.string().required(),
    partnerID: Joi.string().required()
  }),
}), tokenizerController.getTokenizedResult);

router.post('/audiotokenize',type,tokenizerController.getAudioTokenizedResult)

module.exports = router;
