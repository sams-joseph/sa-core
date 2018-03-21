const express = require('express');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

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

module.exports = api;
