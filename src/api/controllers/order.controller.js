/*eslint-disable */
const httpStatus = require("http-status");
const { omit } = require("lodash");
const Order = require("../models/order.model");

/**
 * Create new order
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(httpStatus.CREATED);
    res.json(savedOrder.transform());
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST);
  }
};
