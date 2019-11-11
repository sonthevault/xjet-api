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
    console.log("req.user", req.user);
    const order = new Order({ ...req.body, userId: req.user._id });
    const savedOrder = await order.save();
    res.status(httpStatus.CREATED);
    res.json(savedOrder.transform());
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST);
  }
};

/**
 * get user order
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    console.log("req.user", req.user);
    const order = await Order.findOne({ userId: req.user._id });
    if (order) {
      res.status(httpStatus.OK);
      res.json({ order: order.transform() });
    } else {
      res.status(httpStatus.OK);
      res.json({ order: null });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST);
  }
};
