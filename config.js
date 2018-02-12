const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  dotenv.load();
}

const defaults = {
  POSTGRES_URL: 'postgres://postgres:postgres@localhost/sepsis', // connection string for PostgreSQL
  BACKEND_PORT: '5000',
};

Object.keys(defaults).forEach(key => {
  process.env[key] = key in process.env ? process.env[key] : defaults[key];
});

module.exports = process.env;
