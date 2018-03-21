const express = require('express');

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
  const { productID, name, description, imageUrl } = req.body;
  const design = new db.Design({ productID, name, description, imageUrl });
  design
    .save()
    .then(designRecord => {
      res.status(200).json({ message: 'Design created successfully', design: designRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
