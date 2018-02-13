const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const formatErrors = require('../utils/errors');
const sendResetPasswordEmail = require('../mail/mailer').sendResetPasswordEmail;

const api = express.Router();

api.post('/', (req, res) => {
  const { email, password } = req.body.credentials;
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
            res.status(200).json({
              message: 'User confirmation successful.',
              user: updatedUser.toAuthJSON(),
            })
          )
          .catch(err => res.status(400).json({ errors: err }));
      } else {
        res.status(400).json({
          errors: {
            message: 'User has already been confirmed or does not exist.',
          },
        });
      }

      return null;
    })
    .catch(err => res.status(400).json({ errors: err }));
});

api.post('/reset_password_request', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      sendResetPasswordEmail(user);
      res.json({});
    } else {
      res.status(400).json({ errors: { message: 'There is no user with that email.' } });
    }
  });
});

api.post('/validate_token', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET_KEY, err => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

api.post('/reset_password', (req, res) => {
  const { password, token } = req.body;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ errors: { message: 'User either does not exist or link has expired.' } });
    } else {
      console.log(decoded);
      User.findOne({ id: decoded.id }).then(user => {
        if (user) {
          user.setPassword(password);
          user.save().then(() => res.json({}));
        } else {
          res.status(404).json({ errors: { message: 'User either does not exist or link has expired.' } });
        }
      });
    }
  });
});

module.exports = api;
