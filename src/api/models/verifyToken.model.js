/*eslint-disable */
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");

const verifyTokenType = ["confirmation", "forgot_password"]

const verifyTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  type: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});


/**
 * @typedef VerifyToken
 */
module.exports = mongoose.model("VerifyToken", verifyTokenSchema);