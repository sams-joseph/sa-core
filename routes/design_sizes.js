const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/all', authenticate, (req, res) => {
  db.DesignSize.findAll({
    where: {
      isDeleted: false,
    },
    include: [
      {
        model: db.Design,
      },
      {
        model: db.Size,
      },
    ],
  })
    .then(designSizes => {
      res.status(200).json({ designSizes });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/', authenticate, (req, res) => {
  const { designId, sizeId } = req.query;
  db.DesignSize.findOne({
    where: {
      isDeleted: false,
      designId,
      sizeId,
    },
  })
    .then(designSize => {
      res.status(200).json({ designSize });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', authenticate, (req, res) => {
  const { designId, sizeId, imageUrl } = req.body;
  db.DesignSize.create({ imageUrl, designId, sizeId })
    .then(designSize => {
      res.status(200).json({ message: 'Design Size created successfully', designSize });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

AWS.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_KEY,
});

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com/layouts');

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
});

const storage = multerS3({
  s3,
  bucket: 'js-static',
  acl: 'public-read',
  // eslint-disable-next-line
  key: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
}).single('layout');

api.post('/upload', authenticate, (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    return res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
  });
});

module.exports = api;
