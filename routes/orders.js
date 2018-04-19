const express = require('express');
const gradient = require('abcolor').gradient;
const db = require('../models');

const Op = db.Sequelize.Op;
const sendOrderConfirmationEmail = require('../mail/mailer').sendOrderConfirmationEmail;
const authenticate = require('../middleware/authenticate');

const api = express.Router();

api.get('/', authenticate, (req, res) => {
  const { currentUser } = req;
  if (currentUser.roleId === 1) {
    db.Order.findAll({
      include: [
        {
          model: db.Part,
          include: [db.Product, db.Size, db.Design],
        },
      ],
    })
      .then(orders => {
        res.status(200).json({ message: `All orders.`, orders });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  } else {
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
  }
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

api.get('/monthly', authenticate, (req, res) => {
  const { currentUser } = req;
  const { year } = req.query;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  let itemsProcessed = 0;
  if (currentUser.roleId === 1) {
    months.forEach((month, i) => {
      const from = i + 1;
      const to = i === 11 ? 1 : i + 2;
      db.Order.findAll({
        where: {
          createdAt: {
            [Op.between]: [new Date(`${year}-${from}`), new Date(`${year}-${to}`)],
          },
        },
        include: [
          {
            model: db.Part,
            include: [db.Product, db.Size, db.Design],
          },
        ],
      }).then(orders => {
        db.Order.findAll({}).then(allOrders => {
          const totalOrders = allOrders.length;
          const monthlyOrders = orders.length;
          const percentOfTotal = isNaN(monthlyOrders / totalOrders * 100) ? 0 : monthlyOrders / totalOrders * 100;
          const fillColor = gradient(percentOfTotal, {
            css: true,
            from: '#3373d6',
            to: '#0D47A1',
          });
          data.push({ name: months[i], value: orders.length, fill: fillColor, Qty: orders.length });
          itemsProcessed += 1;
          if (itemsProcessed === months.length) {
            res.status(200).json({ message: `All orders.`, monthlyData: data });
          }
        });
      });
    });
  } else {
    db.User.findOne({ where: { email: currentUser.email } })
      .then(user => {
        months.forEach((month, i) => {
          const from = i + 1;
          const to = i === 11 ? 1 : i + 2;
          user
            .getOrders({
              where: {
                createdAt: {
                  [Op.between]: [new Date(`${year}-${from}`), new Date(`${year}-${to}`)],
                },
              },
              include: [
                {
                  model: db.Part,
                  include: [db.Product, db.Size, db.Design],
                },
              ],
            })
            .then(orders => {
              user.getOrders({}).then(allOrders => {
                const totalOrders = allOrders.length;
                const monthlyOrders = orders.length;
                const percentOfTotal = isNaN(monthlyOrders / totalOrders * 100) ? 0 : monthlyOrders / totalOrders * 100;
                const fillColor = gradient(percentOfTotal, {
                  css: true,
                  from: '#3373d6',
                  to: '#0D47A1',
                });
                data.push({ name: months[i], value: orders.length, fill: fillColor, Qty: orders.length });
                itemsProcessed += 1;
                if (itemsProcessed === months.length) {
                  res.status(200).json({ message: `Orders for ${user.email}.`, monthlyData: data });
                }
              });
            });
        });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  }
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

api.post('/confirm', authenticate, (req, res) => {
  const { order } = req.body;
  const { currentUser } = req;

  Promise.all([
    db.Order.findOne({
      where: {
        isDeleted: false,
        id: order.id,
      },
      include: [
        {
          model: db.Part,
          include: [db.Product, db.Size, db.Design],
        },
      ],
    }),
    db.User.findOne({
      where: {
        isDeleted: false,
        id: currentUser.id,
      },
      include: [db.Subscription, db.Csr],
    }),
  ]).then(results => {
    if (results[1]) {
      sendOrderConfirmationEmail(results[1], results[0]);
    }
    res.status(200).json({ message: 'Order placed successfully' });
  });
});

api.post('/part', authenticate, (req, res) => {
  const { orderId, productId, sizeId, designId, quantity, name, date, image, portrait } = req.body;
  const { currentUser } = req;

  db.Order.findById(orderId).then(order => {
    order
      .createPart({
        userId: currentUser.id,
        productId,
        sizeId,
        designId,
        quantity,
        name,
        date,
        image,
        portrait,
      })
      .then(result => {
        res.status(200).json({ message: 'Part created successfully', order: result });
      })
      .catch(err => {
        res.status(400).json({ message: 'Error creating part', err });
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

api.get('/parts/designs', authenticate, (req, res) => {
  const { currentUser } = req;
  const data = [];
  let itemsProcessed = 0;

  if (currentUser.roleId === 1) {
    db.Design.findAll({
      where: {
        isDeleted: false,
      },
    })
      .then(designs => {
        designs.forEach(design => {
          Promise.all([
            db.Part.findAll({
              where: {
                isDeleted: false,
                designId: design.id,
              },
            }),
            db.Part.findAll({ where: { isDeleted: false } }),
          ])
            .then(results => {
              const totalOrders = results[1].length;
              const monthlyOrders = results[0].length;
              const percentOfTotal = isNaN(monthlyOrders / totalOrders * 100) ? 0 : monthlyOrders / totalOrders * 100;
              const fillColor = gradient(percentOfTotal, {
                css: true,
                from: '#3373d6',
                to: '#0D47A1',
              });
              data.push({ name: design.name, value: monthlyOrders, fill: fillColor, Qty: monthlyOrders });
              itemsProcessed += 1;
              if (itemsProcessed === designs.length) {
                res.status(200).json({ designData: data });
              }
            })
            .catch(err => {
              res.status(400).json({ errors: err });
            });
        });
      })
      .catch(error => {
        console.log(error);
        res.status(400).json({ errors: error });
      });
  } else {
    db.Design.findAll({
      where: {
        isDeleted: false,
      },
    })
      .then(designs => {
        designs.forEach(design => {
          db.Part.findAll({
            where: {
              isDeleted: false,
              designId: design.id,
              userId: currentUser.id,
            },
          })
            .then(parts => {
              db.User.findOne({ where: { email: currentUser.email } }).then(user => {
                user
                  .getParts({})
                  .then(allParts => {
                    const totalOrders = allParts.length;
                    const monthlyOrders = parts.length;
                    const percentOfTotal = isNaN(monthlyOrders / totalOrders * 100)
                      ? 0
                      : monthlyOrders / totalOrders * 100;
                    const fillColor = gradient(percentOfTotal, {
                      css: true,
                      from: '#3373d6',
                      to: '#0D47A1',
                    });
                    data.push({ name: design.name, value: parts.length, fill: fillColor, Qty: parts.length });
                    itemsProcessed += 1;
                    if (itemsProcessed === designs.length) {
                      res.status(200).json({ designData: data });
                    }
                  })
                  .catch(err => {
                    res.status(400).json({ errors: err });
                  });
              });
            })
            .catch(err => {
              res.status(400).json({ errors: err });
            });
        });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  }
});

api.get('/parts/products', authenticate, (req, res) => {
  const { currentUser } = req;
  const data = [];
  let itemsProcessed = 0;

  if (currentUser.roleId === 1) {
    db.Size.findAll({
      where: {
        isDeleted: false,
      },
    })
      .then(sizes => {
        sizes.forEach(size => {
          Promise.all([
            db.Part.findAll({
              where: {
                isDeleted: false,
                sizeId: size.id,
              },
            }),
            db.Part.findAll({ where: { isDeleted: false } }),
          ])
            .then(results => {
              const totalOrders = results[1].length;
              const monthlyOrders = results[0].length;
              const percentOfTotal = isNaN(monthlyOrders / totalOrders * 100) ? 0 : monthlyOrders / totalOrders * 100;
              const fillColor = gradient(percentOfTotal, {
                css: true,
                from: '#3373d6',
                to: '#0D47A1',
              });
              data.push({ name: size.displayName, value: monthlyOrders, fill: fillColor, Qty: monthlyOrders });
              itemsProcessed += 1;
              if (itemsProcessed === sizes.length) {
                res.status(200).json({ sizeData: data });
              }
            })
            .catch(err => {
              res.status(400).json({ errors: err });
            });
        });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  } else {
    db.Size.findAll({
      where: {
        isDeleted: false,
      },
    })
      .then(sizes => {
        sizes.forEach(size => {
          db.Part.findAll({
            where: {
              isDeleted: false,
              sizeId: size.id,
              userId: currentUser.id,
            },
          })
            .then(parts => {
              db.User.findOne({ where: { email: currentUser.email } }).then(user => {
                user
                  .getParts({})
                  .then(allParts => {
                    const totalOrders = allParts.length;
                    const monthlyOrders = parts.length;
                    const percentOfTotal = isNaN(monthlyOrders / totalOrders * 100)
                      ? 0
                      : monthlyOrders / totalOrders * 100;
                    const fillColor = gradient(percentOfTotal, {
                      css: true,
                      from: '#3373d6',
                      to: '#0D47A1',
                    });
                    data.push({ name: size.displayName, value: parts.length, fill: fillColor, Qty: parts.length });
                    itemsProcessed += 1;
                    if (itemsProcessed === sizes.length) {
                      res.status(200).json({ sizeData: data });
                    }
                  })
                  .catch(err => {
                    res.status(400).json({ errors: err });
                  });
              });
            })
            .catch(err => {
              res.status(400).json({ errors: err });
            });
        });
      })
      .catch(err => {
        res.status(400).json({ errors: err });
      });
  }
});

module.exports = api;
