const Sequelize = require('sequelize');

const db = require('../store/db');

const DesignSize = db.define('design_sizes', {
  designID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sizeID: {
    type: Sequelize.INTEGER,
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

module.exports = DesignSize;
