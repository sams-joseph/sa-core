const express = require('express');

const Size = require('../models/Size');

const api = express.Router();

api.get('/', (req, res) => {
  const { id } = req.query;
  Size.findAll({
    where: {
      isDeleted: false,
      productID: id,
    },
  })
    .then(sizes => {
      res.status(200).json({ sizes });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', (req, res) => {
  const { displayName, productID, height, width } = req.body;
  const size = new Size({ displayName, productID, height, width });
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
