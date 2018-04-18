const express = require('express');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { id } = req.query;
  db.Size.findAll({
    where: {
      isDeleted: false,
      productId: id,
    },
  })
    .then(sizes => {
      res.status(200).json({ sizes });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/all', authenticate, (req, res) => {
  db.Size.findAll({
    where: {
      isDeleted: false,
    },
  })
    .then(sizes => {
      res.status(200).json({ sizes });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/size', authenticate, (req, res) => {
  const { id } = req.query;
  db.Size.findOne({
    where: {
      isDeleted: false,
      id,
    },
  })
    .then(size => {
      res.status(200).json({ size });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', authenticate, (req, res) => {
  const { displayName, productId, height, width } = req.body;
  const size = new db.Size({ displayName, productId, height, width });
  size
    .save()
    .then(sizeRecord => {
      res.status(200).json({ message: 'Size created successfully', size: sizeRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
