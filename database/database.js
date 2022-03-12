const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const knex = require('knex')
const knexfile = require('./knexfile')

let database

try {
    database = knex(knexfile.development); // Initializing the DB with the knex configuration
    console.log("DB CONNECTION SUCCESSFUL!")
} catch (err) {
    console.log("AN ERROR OCCURED", err)
}
// console.log(database)

module.exports = database;
