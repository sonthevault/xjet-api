/*eslint-disable */
const mongoose = require("mongoose");

const OrderStatuses = ["pending", "confirmed"]

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    xjetUserId: { type: String, required: true },
    amount: { type: Number, default: 0 },
    senderUsdtAddress: { type: String },
    senderBTCAddress: { type: String, required: true },
    status: { type: String, enum: OrderStatuses, default: "pending"}
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
    const fields = ["email", "userId", "amount", "senderUsdtAddress", "senderBTCAddress", "status"];

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
