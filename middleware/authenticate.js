const jwt = require('jsonwebtoken');
const db = require('../models');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  let token;
  if (header) token = header.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: 'Invalid token' } });
      } else {
        db.User.findOne({ where: { email: decoded.email } }).then(user => {
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    res.status(401).json({ errors: { global: 'No token' } });
  }
};

module.exports = authenticate;
