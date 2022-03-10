const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

// Function to sign JWT with a given ID
const sign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to create a unique ID
exports.createId = (num) => {
  const id = crypto.randomBytes(num).toString("hex");
  return id;
};

// Function to create and send JsonWebTokens
exports.createSendToken = (user, code, res) => {
  const token = sign(user.id); // Signing the token with the user's ID
  user.password = undefined; // Setting the user password to undefined for security reasons

  // Returning a successful response with token and user data
  res.status(code).json({
    status: "success",
    token: token,
    data: { user },
  });
};

// Function to decode JWT with the secret
exports.decodeJWT = async (token) => {
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decoded;
};

// Helper function to apply DRY principle
exports.catchErrorMessage = (res, error) => {
  console.log(error); // Log the error to the console

  // Returning a specific message if the error is based on duplicate entry
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      status: "failed",
      message: error.sqlMessage,
    });
  }

  // Returning every other kind of error
  return res.status(500).json({
    status: "failed",
    message: "An error occured",
    err: error.message,
    stack: error.stack,
  });
};
