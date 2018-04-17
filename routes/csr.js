const express = require('express');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  db.Csr.findAll({
    where: {
      isDeleted: false,
    },
  })
    .then(csrs => {
      res.status(200).json({ csrs });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/csr', authenticate, (req, res) => {
  const { id } = req.query;
  db.Csr.findOne({
    where: {
      isDeleted: false,
      id,
    },
  })
    .then(csr => {
      res.status(200).json({ csr });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/customers', authenticate, (req, res) => {
  const { id } = req.query;
  db.Csr.findOne({
    where: {
      isDeleted: false,
      id,
    },
  })
    .then(csr => {
      csr
        .getCustomers()
        .then(customers => {
          res.status(200).json({ customers });
        })
        .catch(err => {
          res.status(400).json({ errors: err });
        });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', authenticate, (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const csr = new db.Csr({ firstName, lastName, email, phone });
  csr
    .save()
    .then(csrRecord => {
      res.status(200).json({ message: 'CSR created successfully', csr: csrRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/customers', authenticate, (req, res) => {
  const { csrId, userId } = req.body;
  Promise.all([
    db.Csr.findOne({
      where: {
        isDeleted: false,
        id: csrId,
      },
    }),
    db.User.findOne({
      where: {
        isDeleted: false,
        id: userId,
      },
    }),
  ])
    .then(results => {
      const user = results[1];
      const csr = results[0];

      csr
        .addCustomers(user)
        .then(() => {
          res.status(200).json({ message: 'Customer added to CSR successfully' });
        })
        .catch(err => {
          res.status(400).json({ errors: err });
        });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
