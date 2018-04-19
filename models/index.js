const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {
  User: sequelize.import('./user'),
  Order: sequelize.import('./order'),
  Part: sequelize.import('./part'),
  Product: sequelize.import('./product'),
  Size: sequelize.import('./size'),
  Design: sequelize.import('./design'),
  DesignSize: sequelize.import('./designSize'),
  Role: sequelize.import('./role'),
  Subscription: sequelize.import('./subscription'),
  Csr: sequelize.import('./csr'),
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
