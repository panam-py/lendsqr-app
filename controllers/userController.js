const database = require("../database/database");
const utilities = require("../utils/utilities");
const AppError = require("../utils/appError");

// Controller function to get all users in the DB
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await database("users").select(); // Query the DB for all the users present

    // Mapping through the users array to set the password as undefined for security reasons
    users.map((user) => {
      user.password = undefined;
    });

    // Returning a successful response as well as the data required
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

// Controller function to get a specific user in the DB
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Collecting the intended user ID from the request parameter

    // Returning an error if userId is not present in request parameters
    if (!userId) {
      return next(
        new AppError("Please provide user Id as request parameter", 400)
      );
    }

    const user = await database("users").first("*").where({ id: userId }); // Querying the DB for said user using the userId

    // Returning an error if user is not present in DB
    if (!user) {
      return next(new AppError("No user found with that Id!", 404));
    }

    // Returning a successful response as well as the data required
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

// Controller function to fund a user's account
exports.fund = async (req, res, next) => {
  try {
    let { amount } = req.body; // Collecting data from request body

    // Returning an error if amount is not present in request body
    if (!amount) {
      return next(new AppError("Please provide amount in request body", 400));
    }

    // Returning an error if amount given is not a number
    if (isNaN(amount)) {
      return next(new AppError("Amount must be a number", 400));
    }

    amount = amount * 1; // Converting amount to an integer

    user = req.user; // Collecting logged in user's info from the request object
    newBalance = user.balance + amount; // Setting user's new balance

    await database("users")
      .where({ id: user.id })
      .update({ balance: newBalance }); // Updating the user in the DB
    const updatedUser = await database("users")
      .first("*")
      .where({ id: user.id }); // Querying the DB for updated user

    // Returning a successful response as well as the data required
    res.status(200).json({
      status: "success",
      message: `Account successfully funded with ${amount}, new account balance is ${newBalance}`,
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

// Controller function to withdraw from a user's account
exports.withdraw = async (req, res, next) => {
  try {
    let amount = req.body.amount; // Collecting data from request body
    user = req.user; // Collecting logged in user's info from the request object

    // Returning an error if amount is not present in request body
    if (!amount) {
      return next(new AppError("Please provide amount in request body", 400));
    }

    // Returning an error if amount given is not a number
    if (isNaN(amount)) {
      return next(new AppError("Amount must be a number", 400));
    }

    amount = amount * 1; // Returning an error if amount given is not a number

    // Returning an error if user does not have sufficient funds
    if (amount > req.user.balance) {
      return next(new AppError("Insufficient funds!", 400));
    }

    const newBalance = user.balance - amount; // Setting user's new balance

    await database("users")
      .where({ id: user.id })
      .update({ balance: newBalance }); // Updating the user in the DB
    const updatedUser = await database("users")
      .first("*")
      .where({ id: user.id }); // Querying the DB for updated user

    // Returning a successful response as well as the data required
    res.status(200).json({
      status: "success",
      message: `Account successfully debited with ${amount}, new account balance is ${newBalance}`,
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

// Controller function to transfer from one account to another
exports.transfer = async (req, res, next) => {
  try {
    sender = req.user; // Collecting logged in user's info from the request object

    // Collecting data from request body
    const beneficiaryId = req.body.beneficiaryId;
    let amount = req.body.amount;

    // Returning an error of any of the required data is missing
    if (!amount || !beneficiaryId) {
      return next(
        new AppError(
          "Please provide beneficiaryId and amount in request body",
          400
        )
      );
    }

    // Returning an error if amount given is not a number
    if (isNaN(amount)) {
      return next(new AppError("amount must be a number", 400));
    }

    amount = amount * 1; // Returning an error if amount given is not a number

    beneficiary = await database("users")
      .first("*")
      .where({ id: beneficiaryId }); // Querying the DB for the beneficiary's info based on data given

    // Returning an error if no beneficiary account is found in the DB
    if (!beneficiary) {
      return next(new AppError("No account found with that ID", 404));
    }

    // Returning an error if sender does not have sufficient funds
    if (amount > sender.balance) {
      return next(new AppError("Insufficient funds!", 400));
    }

    // Setting new balances for both parties
    const newSenderBalance = sender.balance - amount;
    const newBeneficiaryBalance = beneficiary.balance + amount;

    // Creating an array to store useful info about both parties
    const zip = [
      { id: sender.id, balance: newSenderBalance },
      { id: beneficiary.id, balance: newBeneficiaryBalance },
    ];

    const update = []; // Initializing a new array to store updated users
    let updatedSender;

    //Mapping through each user in the zip array to update and query the DB for the updated user, updated users are also added to eh update array
    await Promise.all(
      zip.map(async (person) => {
        await database("users")
          .where({ id: person.id })
          .update({ balance: person.balance });

        updatedUser = await database("users")
          .first("*")
          .where({ id: person.id });
        update.push(updatedUser);
      })
    );

    // Returning a successful response as well as the data required
    res.status(200).json({
      status: "success",
      message: `${amount} has successfully been transferred from ${update[0].name} with id ${update[0].id} to ${update[1].name} with id ${update[1].id}`,
      data: {
        sender: update[0],
        beneficiary: update[1],
      },
    });
  } catch (err) {
    utilities.catchErrorMessage(res, err); // Sending a dynamic error message if the try block fails
  }
};

exports.deleteAllUsers = async (req, res, next) => {
  try {
    await database("users").del();

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    utilities.catchErrorMessage(res, err);
  }
};
