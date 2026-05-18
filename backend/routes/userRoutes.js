const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ============================
// GET ALL USERS (SUPERADMIN ONLY)
// ============================
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  getAllUsers
);

// ============================
// GET USER DETAIL (ADMIN + SUPERADMIN)
// ============================
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  getUserById
);

// ============================
// UPDATE USER (SUPERADMIN ONLY)
// ============================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  updateUser
);

// ============================
// DELETE USER (SUPERADMIN ONLY)
// ============================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  deleteUser
);

module.exports = router;