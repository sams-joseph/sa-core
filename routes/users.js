const express = require('express');

const User = require('../models/User');
const sendConfirmationEmail = require('../mail/mailer').sendConfirmationEmail;

const api = express.Router();

api.post('/', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = new User({ firstName, lastName, email });
  user.setPassword(password);
  user.setConfirmationToken();
  user
    .save()
    .then(userRecord => {
      sendConfirmationEmail(userRecord);
      res.status(200).json({ message: 'User created successfully.', user: userRecord.toAuthJSON() });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
