const express = require('express');
const fs = require('fs');

const db = require('../models');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

function saveImage(image, imageName, cb) {
  const imageData = image.replace(/^data:image\/\w+;base64,/, '');
  const buf = new Buffer(imageData, 'base64');
  fs.writeFileSync(`/usr/src/public/images/${imageName}.png`, buf);
}

api.get('/', authenticate, (req, res) => {
  const { currentUser } = req;
  db.User.findOne({ where: { email: currentUser.email } })
    .then(user => {
      user
        .getOrders({
          include: [
            {
              model: db.Part,
              include: [db.Product, db.Size, db.Design],
            },
          ],
        })
        .then(orders => {
          res.status(200).json({ message: `Orders for ${user.email}.`, orders });
        });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/order', authenticate, (req, res) => {
  const { id } = req.query;
  db.Order.findOne({
    where: {
      isDeleted: false,
      id,
    },
    include: [
      {
        model: db.Part,
        include: [db.Product, db.Size, db.Design],
      },
    ],
  })
    .then(order => {
      res.status(200).json({ order });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/', authenticate, (req, res) => {
  const { shippingName, shippingAddress, shippingCity, shippingState, shippingZip } = req.body;
  const { currentUser } = req;

  db.User.findById(currentUser.id).then(user => {
    user
      .createOrder({
        userId: currentUser.id,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
      })
      .then(order => {
        res.status(200).json({ message: 'Order created successfully', order });
      });
  });
});

api.post('/part', authenticate, (req, res) => {
  const { orderId, productId, sizeId, designId, quantity, name, date, image, portrait } = req.body;
  const imageName = `${100000 + orderId}_${name}_${date}_${Date.now()}`;
  const portraitName = `${100000 + orderId}_${name}_${Date.now()}`;
  saveImage(image, imageName);
  saveImage(portrait, portraitName);

  db.Order.findById(orderId).then(order => {
    order
      .createPart({
        productId,
        sizeId,
        designId,
        quantity,
        name,
        date,
        image: imageName,
        portrait: portraitName,
      })
      .then(result => {
        res.status(200).json({ message: 'Part created successfully', order: result });
      });
  });
});

api.get('/parts', authenticate, (req, res) => {
  const { orderId } = req.query;
  db.Part.findAll({
    where: {
      isDeleted: false,
      orderId,
    },
  })
    .then(parts => {
      res.status(200).json({ parts });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/part', authenticate, (req, res) => {
  const { id } = req.query;
  db.Part.findOne({
    where: {
      isDeleted: false,
      id,
    },
    include: [db.Product, db.Size, db.Design],
  })
    .then(part => {
      res.status(200).json({ part });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
