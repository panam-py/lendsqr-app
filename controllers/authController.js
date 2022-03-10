// Necassary Imports
const db = require("../db/db");
const bcrypt = require("bcryptjs");
const utilities = require("../utils/utilities");
const AppError = require("../utils/appError");

// Function to register a new user into the DB, i.e signup
exports.signUp = async (req, res, next) => {
  try {
    // Collecting data from request body
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const id = utilities.createId(16); // Create a unique ID with the utility function

    // Returning an error if any of this data is not found
    if (!email || !name || !password) {
      return next(
        new AppError(
          "Please provide email, name and password for this user",
          400
        )
      );
    }

    // Constructing user object with collected data
    userObj = {
      id,
      email,
      name,
      password: hashedPassword,
    };

    const user = await db("users").insert(userObj); // Inserting new user into the DB
    utilities.createSendToken(userObj, 201, res); // Creating and sending a JsonWebToken in the response
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

// Function to login a user based on credentials given
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Collecting data from the request body

    // Returning an error if any of this data is not found
    if (!email || !password) {
      return next(
        new AppError("Please provide email and password for this user", 400)
      );
    }

    const user = await db("users").first("*").where({ email }); // Querying the DB for the user based on the email given

    // Return an error is no user is found with those credentials
    if (!user) {
      return next(new AppError("Email or password is incorrect", 401));
    }

    const access = await bcrypt.compare(password, user.password); // Boolean to hold value of password comparison

    // Return an error if password is incorrect
    if (!access) {
      return next(new AppError("Email or password is incorrect", 401));
    }

    utilities.createSendToken(user, 200, res); // Send a JsonWebToken if everything goes well
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

// Middleware function to protect certain routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Checking if Bearer token exists in authorization and initiliazing it to token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token is found return an error
    if (!token) {
      return next(
        new AppError(
          "You are not logged in, please log in to gain access!",
          401
        )
      );
    }

    const decoded = await utilities.decodeJWT(token); // decoding the JsonWebToken using the utility function for this
    const id = decoded.id; // Extracting id from the decoded token

    const currentUser = await db("users").first("*").where({ id }); // Query the DB for the user gotten based on the ID

    // Return an error if no user is found based on the ID.
    if (!currentUser) {
      return next(new AppError("No user exists with that id.", 404));
    }

    req.user = currentUser; // Initialize the user to a new user on the request object

    next(); // Moving to the next middleware
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};
