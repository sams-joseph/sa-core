const express = require('express');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  db.Product.findAll({
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

api.get('/product', authenticate, (req, res) => {
  const { id } = req.query;
  db.Product.findOne({
    where: {
      isDeleted: false,
      id,
    },
    attributes: ['id', 'name', 'description', 'imageUrl', 'createdAt', 'updatedAt'],
  })
    .then(product => {
      res.status(200).json({ product });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', authenticate, (req, res) => {
  const { name, description, imageUrl } = req.body;
  const product = new db.Product({ name, description, imageUrl });
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
