const express = require('express');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { currentUser } = req;
  if (currentUser.roleId === 1) {
    db.Role.findAll({
      where: {
        isDeleted: false,
      },
    })
      .then(roles => {
        res.status(200).json({ roles });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  } else {
    res.status(401).json({ errors: { message: 'Unauthorized to view' } });
  }
});

module.exports = api;
