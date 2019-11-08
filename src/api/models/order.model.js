/*eslint-disable */
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, default: 0 },
    senderUsdtAddress: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
orderSchema.method({
  transform() {
    const transformed = {};
    const fields = ["email", "userId", "amount", "senderUsdtAddress"];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * @typedef Order
 */
module.exports = mongoose.model("Order", orderSchema);
