const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const environment = process.env.ENV || "development"; // Setting the development environment
const config = require("./knexfile")[environment]; // Using the environment to set the configuration settings for knex
const db = require("knex")(config); // Initializing the DB with the knex configuration

module.exports = db;
