const app = require("./app.js");
const db = require("./db/db");
const session = require("express-session");
const Knex = require("connect-session-knex")(session);

const PORT = process.env.PORT;

// Creating a session using the DB
const sessionStore = new Knex({ knex: db });


// Using the created session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// Running the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
