/*eslint-disable */
const express = require('express');
const controller = require('../../controllers/media.controller');
const validate = require('express-validation');
const oAuthLogin = require('../../middlewares/auth').oAuth;
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const { 
    listMedia, getMediaDetail, createMedia, updateMedia 
} = require('../../validations/media.validation');

const upload = multer({
    storage: multer.diskStorage({
      filename: (req, file, cb) => {
        // user shortid.generate() alone if no extension is needed
        cb(null, shortid.generate() + path.parse(file.originalname).ext);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }).single('file');

router
  .post('/', validate(createMedia), upload, controller.create)
  .get('/:id', validate(getMediaDetail), controller.getMediaDetail)
  .put('/:id', authorize(), validate(updateMedia), upload, controller.update)
  .delete('/:id', authorize(), controller.delete);

module.exports = router;
