const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const db = require('../models');

const Op = db.Sequelize.Op;
const sendResetPasswordEmail = require('../mail/mailer').sendResetPasswordEmail;

const api = express.Router();

api.post('/', (req, res) => {
  const email = req.sanitize(req.body.credentials.email);
  const password = req.sanitize(req.body.credentials.password);

  db.User.findOne({ where: { email: { [Op.eq]: email }, isDeleted: false } })
    .then(user => {
      if (user && user.isValidPassword(password, user.password)) {
        res.status(200).json({
          message: 'Successfully logged in.',
          user: user.toAuthJSON(),
        });
      } else {
        res.status(400).json({
          errors: { global: 'Email or Password are Incorrect' },
        });
      }
    })
    .catch(err => err);
});

api.post('/confirmation', (req, res) => {
  const token = req.sanitize(req.body.token);
  db.User.findOne({ where: { confirmationToken: { [Op.eq]: token } } })
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
  const email = req.sanitize(req.body.credentials.email);
  db.User.findOne({ where: { email } }).then(user => {
    if (user) {
      if (user.roleId !== 3) {
        sendResetPasswordEmail(user);
      }
      res.status(200).json({
        message: 'You will receive an email to reset your password.',
      });
    } else {
      res.status(200).json({
        message: 'You will receive an email to reset your password.',
      });
    }
  });
});

api.post('/validate-token', (req, res) => {
  const token = req.sanitize(req.body.token);

  jwt.verify(token, process.env.JWT_SECRET_KEY, err => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

api.post('/reset-password', (req, res) => {
  const password = req.sanitize(req.body.credentials.password);
  const token = req.sanitize(req.body.credentials.token);

  db.User.findOne({ where: { resetPasswordToken: token } }).then(user => {
    if (user && moment(user.resetPasswordExpires).diff(moment()) > 0) {
      user.setPassword(password);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.save().then(() => res.json({ message: 'Your password has been reset successfully.' }));
    } else {
      res.status(400).json({ errors: { global: 'User does not exist or link has expired.' } });
    }
  });
});

api.post('/confirmation', (req, res) => {
  const token = req.sanitize(req.body.token);

  db.User.findOne({ confirmationToken: { [Op.eq]: token } }).then(user => {
    if (user) {
      user.confirmationToken = '';
      user.confirmed = true;
      user.save().then(userRecord => res.json({ user: userRecord.toAuthJSON() }));
    } else {
      res.status(400).json({});
    }
  });
});

module.exports = api;
