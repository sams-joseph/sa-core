module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_development',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_test',
    host: 'postgres',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: 'postgres',
    operatorsAliases: false,
  },
};
