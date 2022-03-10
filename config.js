const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const configuration = {
  DB_DEV: process.env.DB_DEV,
  DB_DEV_HOST: process.env.DB_DEV_HOST,
  DB_DEV_USER: process.env.DB_DEV_USER,
  DB_DEV_PORT: process.env.DB_DEV_PORT,
  DB_DEV_PASSWORD: process.env.DB_DEV_PASSWORD,
  DB_PROD: process.env.DB_PROD,
};

module.exports = configuration;