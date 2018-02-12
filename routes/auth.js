const express = require('express');

const User = require('../models/User');
const formatErrors = require('../utils/errors');

const api = express.Router();

api.post('/', (req, res) => {
  const { email, password } = req.body;
  User.loginUser({
    email,
    password,
  })
    .then(user =>
      res.status(200).json({
        message: 'Successfully logged in.',
        user: user.toAuthJSON(),
      })
    )
    .catch(err => {
      res.status(400).json({
        errors: formatErrors(err.errors),
      });
    });
});

api.post('/confirmation', (req, res) => {
  const token = req.body.token;
  User.update(
    { confirmed: true, confirmationToken: '' },
    { where: { confirmationToken: token }, returning: true, plain: true }
  )
    .then(result => {
      if (result[1].dataValues) {
        User.findOne({ where: { email: result[1].dataValues.email } })
          .then(user => {
            if (user) {
              res.status(200).json({ message: 'User confirmation successful.', user: user.toAuthJSON() });
            }
          })
          .catch(err => res.status(400).json({ errors: err }));
      }
    })
    .catch(err => {
      res.status(400).json({ errors: { message: 'Email has already been confirmed or does not exist.' } });
    });
});

module.exports = api;
