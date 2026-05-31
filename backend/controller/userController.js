const pool = require("../config/db");

// ============================
// GET ALL ADMIN (SUPERADMIN)
// ============================
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        username,
        email,
        role,
        profile,
        created_at
      FROM users
      WHERE role = 'admin'
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// GET USER BY ID
// ============================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT id, username, email, role, profile, created_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const bcrypt = require("bcryptjs");

// ============================
// CREATE USER (SUPERADMIN)
// ============================
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, dan password harus diisi",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, profile, created_at
      `,
      [username, email, hashedPassword, role || "admin"]
    );

    res.status(201).json({
      message: "User berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating user:", error);
    
    if (error.code === "23505") {
      const field = error.detail?.includes("username") ? "Username" : "Email";
      return res.status(409).json({
        message: `${field} sudah terdaftar`,
      });
    }

    res.status(500).json({
      message: error.message || "Gagal membuat user",
    });
  }
};

// ============================
// UPDATE USER (SUPERADMIN)
// ============================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      username,
      email,
      role,
      profile,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        role = COALESCE($3, role),
        profile = COALESCE($4, profile),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, username, email, role, profile
      `,
      [username, email, role, profile, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      message: "User berhasil diupdate",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// DELETE USER
// ============================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};