module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_development',
    host: 'postgres',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_test',
    host: 'postgres',
    dialect: 'postgres',
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: 'postgres',
  },
};
