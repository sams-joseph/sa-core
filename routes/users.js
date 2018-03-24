const express = require('express');

const db = require('../models');
const sendConfirmationEmail = require('../mail/mailer').sendConfirmationEmail;

const api = express.Router();

api.post('/', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  db.User.create({ firstName, lastName, email, password })
    .then(user => {
      Promise.all([user.setRole(2), user.createSubscription()]).then(results => {
        sendConfirmationEmail(results[0]);
        res.status(200).json({ message: 'User created successfully.', user: results[0].toAuthJSON() });
      });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/orders', (req, res) => {
  const { email } = req.query;
  db.User.findOne({ where: { email } })
    .then(user => {
      user.getOrders().then(orders => {
        res.status(200).json({ message: `Orders for ${user.email}.`, orders });
      });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
