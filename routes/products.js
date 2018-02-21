const express = require('express');

const Product = require('../models/Product');

const api = express.Router();

api.get('/', (req, res) => {
  Product.findAll({
    where: {
      isDeleted: false,
    },
    attributes: ['id', 'name', 'description', 'imageUrl', 'createdAt', 'updatedAt'],
  })
    .then(products => {
      res.status(200).json({ products });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', (req, res) => {
  const { name, description, imageUrl } = req.body;
  const product = new Product({ name, description, imageUrl });
  product
    .save()
    .then(productRecord => {
      res.status(200).json({ message: 'Product created successfully', product: productRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
