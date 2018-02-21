const express = require('express');

const Size = require('../models/Size');

const api = express.Router();

api.get('/', (req, res) => {
  const { productID } = req.body;
  Size.findAll({
    where: {
      isDeleted: false,
      productID,
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
  const { productID, height, width } = req.body;
  const size = new Size({ productID, height, width });
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
