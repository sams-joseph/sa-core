const express = require('express');

const DesignSize = require('../models/DesignSize');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { designID, sizeID } = req.query;
  DesignSize.findOne({
    where: {
      isDeleted: false,
      designID,
      sizeID,
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
  const { designID, sizeID, imageUrl } = req.body;
  const designSize = new DesignSize({ designID, sizeID, imageUrl });
  designSize
    .save()
    .then(designSizeRecord => {
      res.status(200).json({ message: 'Design Size created successfully', designSizes: designSizeRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
