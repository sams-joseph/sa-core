const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const hashPassword = require('../utils/hash');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNul: false,
      defaultValue: false,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNul: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  User.associate = models => {
    User.hasMany(models.Order);
  };

  User.beforeCreate(user =>
    hashPassword(user.password).then(hashedPw => {
      user.password = hashedPw;
      user.setConfirmationToken();
    })
  );

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

  return User;
};
