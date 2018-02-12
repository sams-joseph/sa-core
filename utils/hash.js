const bcrypt = require('bcryptjs');

const ROUNDS = 10;

const generatePasswordHash = password => {
  const salt = bcrypt.genSaltSync(ROUNDS);
  return bcrypt.hashSync(password, salt);
};

module.exports = generatePasswordHash;
