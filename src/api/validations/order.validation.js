const Joi = require('joi');

module.exports = {
  // POST /v1/media
  createOrder: {
    body: {
      email: Joi.string().email().required(),
      xjetUserId: Joi.string().required(),
      amount: Joi.number().required(),
      senderBTCAddress: Joi.string().required(),
    },
  },

};
