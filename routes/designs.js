const express = require('express');

const Design = require('../models/Design');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { id } = req.query;
  Design.findAll({
    where: {
      isDeleted: false,
      productID: id,
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

api.post('/', authenticate, (req, res) => {
  const { productID, name, description, imageUrl } = req.body;
  const design = new Design({ productID, name, description, imageUrl });
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
