const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Initializing the router
const router = express.Router();

// Setting routes
router.post("/register", authController.signUp);
router.post("/login", authController.login);
router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUser);
router.delete("/", userController.deleteAllUsers);

// Protecting all routes after this line
router.use(authController.protect);

// Setting routes
router.patch("/fund", userController.fund);
router.patch("/withdraw", userController.withdraw);
router.patch("/transfer", userController.transfer);

module.exports = router;
