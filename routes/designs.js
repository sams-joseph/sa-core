const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { id } = req.query;
  db.Design.findAll({
    where: {
      isDeleted: false,
      productId: id,
    },
    attributes: ['id', 'name', 'description', 'imageUrl', 'createdAt', 'updatedAt'],
  })
    .then(designs => {
      res.status(200).json({ designs });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/all', authenticate, (req, res) => {
  db.Design.findAll({
    where: {
      isDeleted: false,
    },
    attributes: ['id', 'name', 'description', 'imageUrl', 'createdAt', 'updatedAt'],
  })
    .then(designs => {
      res.status(200).json({ designs });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/design', authenticate, (req, res) => {
  const { id } = req.query;
  db.Design.findOne({
    where: {
      isDeleted: false,
      id,
    },
    attributes: ['id', 'name', 'description', 'imageUrl', 'createdAt', 'updatedAt'],
  })
    .then(design => {
      res.status(200).json({ design });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', authenticate, (req, res) => {
  const { productId, name, description, imageUrl } = req.body;
  const design = new db.Design({ productId, name, description, imageUrl });
  design
    .save()
    .then(designRecord => {
      res.status(200).json({ message: 'Design created successfully', design: designRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

AWS.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_KEY,
});

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com/designs');

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
}).single('design');

api.post('/upload', authenticate, (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    return res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
  });
});

module.exports = api;
