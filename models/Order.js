const Sequelize = require('sequelize');

const db = require('../store/db');

const Order = db.define('orders', {
  userID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  shippingName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shippingAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shippingCity: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shippingState: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shippingZip: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

Order.prototype.setOrderInfo = function setOrderInfo() {
  return {
    id: this.id,
    userID: this.userID,
    orderNumber: this.id + 100000,
    shippingName: this.shippingName,
    shippingAddress: this.shippingAddress,
    shippingCity: this.shippingCity,
    shippingState: this.shippingState,
    shippingZip: this.shippingZip,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
  };
};

module.exports = Order;
