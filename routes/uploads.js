const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const api = express.Router();

AWS.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_KEY,
});

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com/uploads');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
});

const storage = multerS3({
  s3,
  bucket: 'js-static',
  acl: 'public-read',
  // eslint-disable-next-line
  key: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadPortrait = multer({
  storage,
}).single('portrait');

api.post('/portrait', (req, res) => {
  uploadPortrait(req, res, err => {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    return res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
  });
});

const uploadMock = multer({
  storage,
}).single('image');

api.post('/mock', (req, res) => {
  uploadMock(req, res, err => {
    if (err) {
      console.log(err);
      return res.status(400).json({ errors: err });
    }
    return res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
  });
});

module.exports = api;
