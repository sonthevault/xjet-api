/*eslint-disable */
const express = require('express');
const controller = require('../../controllers/airdrop.controller');
const validate = require('express-validation');
const router = express.Router();
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

router
  .get('/', authorize(), controller.get)

module.exports = router;
