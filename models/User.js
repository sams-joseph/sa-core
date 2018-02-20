const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const moment = require('moment');

const db = require('../store/db');

const User = db.define('users', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  confirmed: {
    type: Sequelize.BOOLEAN,
    allowNul: false,
    defaultValue: false,
  },
  confirmationToken: {
    type: Sequelize.STRING,
    allowNul: true,
  },
  resetPasswordToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: Sequelize.DATE,
    allowNull: true,
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

User.loginUser = function loginUser(data) {
  return new Promise((ok, reject) => {
    this.findOne({ where: { email: data.email } })
      .then(user => {
        if (user && user.isValidPassword(data.password, user.password)) {
          ok(user);
        } else reject({ errors: { global: 'Email or Password is incorrect' } });
      })
      .catch(err => reject(err));
  });
};

User.prototype.isValidPassword = function isValidPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
};

User.prototype.setPassword = function setPassword(password) {
  const ROUNDS = 10;
  const salt = bcrypt.genSaltSync(ROUNDS);
  this.password = bcrypt.hashSync(password, salt);
};

User.prototype.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

User.prototype.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

User.prototype.generateResetPasswordLink = function generateResetPasswordLink() {
  const resetPasswordToken = this.generateResetPasswordToken();
  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpires = moment().add(1, 'hour');
  this.save();
  return `${process.env.HOST}/reset-password/${this.generateResetPasswordToken()}`;
};

User.prototype.setUserInfo = function setUserInfo() {
  return {
    id: this.id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
  };
};

User.prototype.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      confirmed: this.confirmed,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
};

User.prototype.generateResetPasswordToken = function generateResetPasswordToken() {
  return cryptoRandomString(40);
};

User.prototype.toAuthJSON = function toAuthJSON() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    confirmed: this.confirmed,
    token: this.generateJWT(),
  };
};

module.exports = User;
