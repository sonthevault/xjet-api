/*eslint-disable */
const mongoose = require("mongoose");

const ReferralUserStatuses = ["active", "inactive", "terminated"]

const referralSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ReferralUserStatuses, default: "active"}
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
 * @typedef Referral
 */
module.exports = mongoose.model("Referral", referralSchema);
