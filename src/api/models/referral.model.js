/*eslint-disable */
const mongoose = require("mongoose");

const ReferralUserStatuses = ["active", "inactive", "terminated"]

const referralSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ReferralUserStatuses, default: "inactive"}
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
referralSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "email", "status", "createdAt" ];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


/**
 * Statics
 */
referralSchema.statics = {
  /**
   * List referrals in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of referrals to be skipped.
   * @param {number} limit - Limit number of referrals to be returned.
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

  countReferrals({ userId }) {
    if (userId) {
      return this.count({ userId }).exec();
    }

    return this.count({}).exec();
  },
}

/**
 * @typedef Referral
 */
module.exports = mongoose.model("Referral", referralSchema);
