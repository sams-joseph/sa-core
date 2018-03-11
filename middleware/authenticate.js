const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  let token;
  console.log(header);
  if (header) token = header.split(' ')[1];
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: 'Invalid token' } });
      } else {
        User.findOne({ where: { email: decoded.email } }).then(user => {
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
