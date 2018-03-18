const express = require('express');
const fs = require('fs');

const Order = require('../models/Order');
const OrderPart = require('../models/OrderPart');
const authenticate = require('../middleware/authenticate');

const api = express.Router();

function saveImage(image, imageName, cb) {
  const imageData = image.replace(/^data:image\/\w+;base64,/, '');
  const buf = new Buffer(imageData, 'base64');
  fs.writeFileSync(`/usr/src/public/images/${imageName}.png`, buf);
}

api.get('/', authenticate, (req, res) => {
  const { currentUser } = req;
  Order.findAll({
    where: {
      userID: currentUser.id,
      isDeleted: false,
    },
    attributes: [
      'id',
      'userID',
      'shippingName',
      'shippingAddress',
      'shippingCity',
      'shippingState',
      'shippingZip',
      'isDeleted',
      'createdAt',
      'updatedAt',
    ],
  })
    .then(orders => {
      res.status(200).json({ orders });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/order', authenticate, (req, res) => {
  const { id } = req.query;
  Order.findOne({
    where: {
      isDeleted: false,
      id,
    },
    attributes: [
      'id',
      'userID',
      'shippingName',
      'shippingAddress',
      'shippingCity',
      'shippingState',
      'shippingZip',
      'isDeleted',
      'createdAt',
      'updatedAt',
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
  const order = new Order({
    userID: currentUser.id,
    shippingName,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZip,
  });
  order
    .save()
    .then(orderRecord => {
      res.status(200).json({ message: 'Order created successfully', order: orderRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.get('/parts', authenticate, (req, res) => {
  const { orderID } = req.query;
  OrderPart.findAll({
    where: {
      isDeleted: false,
      orderID,
    },
    attributes: [
      'id',
      'orderID',
      'productID',
      'sizeID',
      'designID',
      'quantity',
      'name',
      'date',
      'image',
      'portrait',
      'createdAt',
      'updatedAt',
    ],
  })
    .then(parts => {
      res.status(200).json({ parts });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

api.post('/part', authenticate, (req, res) => {
  const { orderID, productID, sizeID, designID, quantity, name, date, image, portrait } = req.body;
  const imageName = `${100000 + orderID}_${name}_${date}_${Date.now()}`;
  const portraitName = `${100000 + orderID}_${name}_${Date.now()}`;
  saveImage(image, imageName);
  saveImage(portrait, portraitName);

  const part = new OrderPart({
    orderID,
    productID,
    sizeID,
    designID,
    quantity,
    name,
    date,
    image: imageName,
    portrait: portraitName,
  });
  part
    .save()
    .then(partRecord => {
      res.status(200).json({ message: 'Part created successfully', part: partRecord });
    })
    .catch(err => {
      res.status(400).json({ errors: err });
    });
});

module.exports = api;
