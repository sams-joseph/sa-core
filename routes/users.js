const express = require('express');
const jwt = require('jsonwebtoken');

const db = require('../models');
const sendConfirmationEmail = require('../mail/mailer').sendConfirmationEmail;
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.post('/', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const roleId = req.body.roleId ? req.body.roleId : 2;
  const csrId = req.body.csrId ? req.body.csrId : 1;
  const { token } = req.query;

  const header = req.headers.authorization;
  let jwtToken;
  if (header) jwtToken = header.split(' ')[1];
  if (jwtToken) {
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: 'Invalid token' } });
      } else {
        db.User.findOne({ where: { email: decoded.email } }).then(currentUser => {
          if (currentUser.roleId === 1) {
            db.User.create({ firstName, lastName, email, password, roleId, csrId })
              .then(user => {
                Promise.all([user.setRole(roleId), user.createSubscription(), user.setCsr(csrId)]).then(results => {
                  sendConfirmationEmail(results[0]);
                  res.status(200).json({ message: 'User created successfully.', user: results[0].toAuthJSON() });
                });
              })
              .catch(err => {
                res.status(400).json({ errors: err });
              });
          }
        });
      }
    });
  } else if (token === process.env.TEMP_TOKEN) {
    db.User.create({ firstName, lastName, email, password, roleId, csrId })
      .then(user => {
        Promise.all([user.setRole(roleId), user.createSubscription(), user.setCsr(csrId)]).then(results => {
          sendConfirmationEmail(results[0]);
          res.status(200).json({ message: 'User created successfully.', user: results[0].toAuthJSON() });
        });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  } else {
    res.status(401).json({ errors: { message: 'Invalid token' } });
  }
});

api.get('/', authenticate, (req, res) => {
  const { currentUser } = req;
  if (currentUser.roleId === 1) {
    db.User.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.Role,
        },
        {
          model: db.Subscription,
        },
        {
          model: db.Csr,
        },
      ],
      attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'confirmed'],
    })
      .then(users => {
        res.status(200).json({ message: 'User created successfully.', users });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  } else {
    res.status(401).json({ errors: { message: 'Not Authorized' } });
  }
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
