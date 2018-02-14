const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');

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

api.post('/forgot-password', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      sendResetPasswordEmail(user);
      res.json({ message: 'An email has been sent with a link to reset your password.' });
    } else {
      res.status(400).json({ errors: { message: 'There is no user with that email.' } });
    }
  });
});

api.post('/validate-token', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET_KEY, err => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

api.post('/reset-password', (req, res) => {
  const { password, token } = req.body;
  User.findOne({ resetPasswordToken: token }).then(user => {
    if (user && moment(user.resetPasswordExpires).diff(moment()) > 0) {
      user.setPassword(password);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.save().then(() => res.json({ message: 'Your password has been reset successfully.' }));
    } else {
      res.status(404).json({ errors: { message: 'User either does not exist or link has expired.' } });
    }
  });
});

module.exports = api;
