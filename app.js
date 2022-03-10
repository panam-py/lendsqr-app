const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const globalAppErrorHandler = require("./controllers/errorController");

// Setting environment variables -- testchange
dotenv.config({ path: "./config.env" });

// Initializing application
const app = express();

// Implementing CORS
app.use(cors());

// Parsing JSON
app.use(express.json());

// Allowing the morgan tool if in development environment
if (process.env.ENV === "development") {
  app.use(morgan("dev"));
}

// Setting the user router for a particular pat
app.use("/api/v1/users", userRouter);

// Using the global error handler in the app
app.use(globalAppErrorHandler);

module.exports = app;
