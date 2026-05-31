const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile,
  updateProfile,
} = require("../controller/authController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

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
  upload.single("profile"),
  updateProfile
);

module.exports = router;