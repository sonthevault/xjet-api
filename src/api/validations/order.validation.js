const Joi = require('joi');

module.exports = {
  // POST /v1/media
  createOrder: {
    body: {
      email: Joi.string().email().required(),
      userId: Joi.string().required(),
      amount: Joi.number().required(),
      senderUsdtAddress: Joi.string().required(),
    },
  },

};
