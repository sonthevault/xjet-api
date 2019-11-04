const Joi = require('joi');

module.exports = {

  // GET /v1/media
  listMedia: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      type: Joi.string(),
    },
  },

  // GET /v1/media/:mediaId
  getMediaDetail: {
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    },
  },

  // POST /v1/media
  createMedia: {
    body: {
      name: Joi.string(),
      type: Joi.string(),
    },
  },

  // PUT /v1/media/:mediaId
  updateMedia: {
    body: {
      name: Joi.string(),
      type: Joi.string(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    },
  },
};
