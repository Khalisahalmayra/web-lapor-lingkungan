const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
  updateProfile,
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

// UPDATE PROFILE
router.put(
  "/update-profile",
  authMiddleware,
  updateProfile
);

module.exports = router;