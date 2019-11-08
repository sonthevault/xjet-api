/*eslint-disable */
const express = require('express');
const controller = require('../../controllers/order.controller');
const { createOrder } = require('../../validations/order.validation');
const validate = require('express-validation');
const router = express.Router();

router
  .post('/', validate(createOrder), controller.create)

module.exports = router;
