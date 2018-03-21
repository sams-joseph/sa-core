const bcrypt = require('bcryptjs');

const ROUNDS = 10;

const hashPassword = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(ROUNDS, (err, salt) => {
      if (err) return reject(err);

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });

module.exports = hashPassword;
