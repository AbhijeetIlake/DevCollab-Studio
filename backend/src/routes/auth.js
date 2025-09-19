const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getCurrentUser,
  searchUsers,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Register user
router.post(
  "/register",
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

// Login user
router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  login
);

// Get current logged in user
router.get("/me", authenticate, getCurrentUser);

// Search users by username or email
router.get("/search", authenticate, searchUsers);

module.exports = router;
