const path = require("path");
const dotenv = require('dotenv')


dotenv.config({ path: "../config.env" });

console.log(process.env.DB_DEV)

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "password",
      database: "lendsqr",
    },
    migrations: {
      directory: path.join(__dirname, "./models/migrations"),
    },
  },
  production: {
    client: "pg",
    connection: process.env.DB_PROD,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, "./models/migrations"),
    },
  },
};


