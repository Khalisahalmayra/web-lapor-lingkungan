const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
} = require("../controller/authController");

const authMiddleware = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// PROFILE
router.get(
  "/profile",
  authMiddleware,
  profile
);

module.exports = router;