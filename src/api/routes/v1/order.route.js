/*eslint-disable */
const express = require('express');
const controller = require('../../controllers/order.controller');
const { createOrder } = require('../../validations/order.validation');
const validate = require('express-validation');
const router = express.Router();
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

router
  .post('/', authorize(), validate(createOrder), controller.create)
  .get('/', authorize(), controller.get)

module.exports = router;
