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
  User.findOne({ where: { confirmationToken: token } })
    .then(user => {
      if (user) {
        user
          .update({ confirmed: true, confirmationToken: '' })
          .then(updatedUser =>
            res.status(200).json({ message: 'User confirmation successful.', user: updatedUser.toAuthJSON() })
          )
          .catch(err => res.status(400).json({ errors: err }));
      } else {
        res.status(400).json({ errors: { message: 'User has already been confirmed or does not exist.' } });
      }

      return null;
    })
    .catch(err => res.status(400).json({ errors: err }));
});

module.exports = api;
