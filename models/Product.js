const Sequelize = require('sequelize');

const db = require('../store/db');

const Product = db.define('products', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
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

Product.prototype.setProductInfo = function setProductInfo() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    imageUrl: this.imageUrl,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
  };
};

module.exports = Product;
