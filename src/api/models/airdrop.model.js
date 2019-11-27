/*eslint-disable */
const mongoose = require("mongoose");

const AirdropTypes = ["referral", "commission"]

const airdropSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, default: null },
    amount: { type: Number },
    type: { type: String, enum: AirdropTypes, default: "commission"}
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
airdropSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "source", "type", "amount", "createdAt" ];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


/**
 * Statics
 */
airdropSchema.statics = {
  /**
   * List Airdrop in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of Airdrop to be skipped.
   * @param {number} limit - Limit number of Airdrop to be returned.
   * @returns {Promise<Referral[]>}
   */
  list({ page = 1, perPage = 100, userId }) {
    if (userId) {
      return this.find({ userId })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    }
    return this.find({})
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  countAirdrops({ userId }) {
    if (userId) {
      return this.count({ userId }).exec();
    }

    return this.count({}).exec();
  },
}

/**
 * @typedef Airdrop
 */
module.exports = mongoose.model("Airdrop", airdropSchema);
