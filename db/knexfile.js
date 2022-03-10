const path = require("path");
const config = require("../config");


module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: config.DB_DEV_HOST,
      port: config.DB_DEV_PORT,
      user: config.DB_DEV_USER,
      password: config.DB_DEV_PASSWORD,
      database: config.DB_DEV,
    },
    migrations: {
      directory: path.join(__dirname, "./models/migrations"),
    },
  },
  production: {
    client: "pg",
    connection: config.DB_PROD,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, "./models/migrations"),
    },
  },
};
