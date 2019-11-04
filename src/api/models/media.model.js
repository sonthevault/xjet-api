/*eslint-disable */
const mongoose = require("mongoose");

/**
 * Media Schema
 * @private
 */
const mediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
    },
    type: {
      type: String,
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    uploadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true
  }
);

mediaSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "name", "type", "url", "uploadBy"];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
mediaSchema.statics = {
  /**
   * List media files in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ page = 1, perPage = 100, name = "" }) {
    // return this.find({ name: { $regex: `.*${name}.*` } })
    if (name) {
      return this.find({ $text: { $search: name } })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
    }
    return this.find({ })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  countMediaFiles({ name = "" }) {
    if (name) {
      return this.count({ $text: { $search: name } }).exec();
    }

    return this.count({}).exec();
  },

  /**
   * Find Media by id
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async getMediaDetail(mediaId) {
    return this.findById(mediaId)
      .populate('uploadBy')
      .exec();
  }
};

/**
 * @typedef Media
 */
module.exports = mongoose.model("Media", mediaSchema);
