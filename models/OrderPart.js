const Sequelize = require('sequelize');

const db = require('../store/db');

const OrderPart = db.define('orderparts', {
  orderID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  productID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sizeID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  designID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  portrait: {
    type: Sequelize.STRING,
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

OrderPart.prototype.setOrderPartInfo = function setOrderPartInfo() {
  return {
    id: this.id,
    orderID: this.orderID,
    productID: this.productID,
    sizeID: this.sizeID,
    designID: this.designID,
    quantity: this.quantity,
    name: this.name,
    date: this.date,
    image: this.image,
    portrait: this.portrait,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
  };
};

module.exports = OrderPart;
