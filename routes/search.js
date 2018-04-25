const express = require('express');
const db = require('../models');

const Op = db.Sequelize.Op;
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { currentUser } = req;
  const query = req.sanitize(req.query.query);
  const limit = req.sanitize(req.query.limit);
  const offset = req.sanitize(req.query.offset);
  db.User.findOne({ where: { email: currentUser.email } })
    .then(user => {
      user
        .getOrders({
          include: [
            {
              model: db.Part,
              where: {
                [Op.or]: [
                  {
                    name: { [Op.iLike]: `%${query}%` },
                  },
                  {
                    date: { [Op.iLike]: `%${query}%` },
                  },
                ],
              },
              include: [db.Product, db.Size, db.Design],
            },
          ],
          limit,
          offset,
        })
        .then(orders => {
          res.status(200).json({ message: `Orders for ${user.email}.`, orders });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
