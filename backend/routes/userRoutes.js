const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getAllUsersRoleUser
} = require("../controller/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ============================
// GET ALL USERS (SUPERADMIN ONLY)
// ============================
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["Superadmin"]),
  getAllUsers
);

// ============================
// GET ALL USER ROLE USER
// ============================
router.get(
  "/role-user",
  authMiddleware,
  roleMiddleware(["Superadmin"]),
  getAllUsersRoleUser
);

// ============================
// GET USER DETAIL (ADMIN + SUPERADMIN)
// ============================
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "Superadmin"]),
  getUserById
);

// ============================
// UPDATE USER (SUPERADMIN ONLY)
// ============================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Superadmin"]),
  updateUser
);

// ============================
// DELETE USER (SUPERADMIN ONLY)
// ============================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Superadmin"]),
  deleteUser
);

// ============================
// CREATE USER (SUPERADMIN ONLY)
// ============================
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Superadmin"]),
  createUser
);

module.exports = router;