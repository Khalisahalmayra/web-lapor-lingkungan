const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// REGISTER
// =========================
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // cek email
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user (default role = user)
    await pool.query(
      `
      INSERT INTO users(username, email, password, role)
      VALUES($1, $2, $3, $4)
      `,
      [username, email, hashedPassword, "user"]
    );

    return res.status(201).json({
      message: "Register berhasil",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// LOGIN (FIXED FULL RESPONSE)
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ambil user + role
    const result = await pool.query(
      "SELECT id, username, email, password, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const user = result.rows[0];

    // cek password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 🔥 FIX PENTING: kirim user ke frontend
    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// PROFILE (OPTIONAL AMAN)
// =========================
const profile = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, username, email, role
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.json({
      user: result.rows[0],
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================
const updateProfile = async (
  req,
  res
) => {

  try {

    const {
      username,
      email,
      password,
      profile,
    } = req.body;

    let hashedPassword = null;

    // kalau password diisi
    if (password && password !== "") {

      hashedPassword =
        await bcrypt.hash(password, 10);
    }

    // ambil user lama
    const oldUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (
      oldUser.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "User tidak ditemukan",
      });
    }

    const currentUser =
      oldUser.rows[0];

    // update database
    const result = await pool.query(
      `
      UPDATE users
      SET
        username = $1,
        email = $2,
        password = $3,
        profile = $4
      WHERE id = $5
      RETURNING id, username, email, role, profile
      `,
      [
        username ||
          currentUser.username,

        email ||
          currentUser.email,

        hashedPassword ||
          currentUser.password,

        profile ||
          currentUser.profile,

        req.user.id,
      ]
    );

    return res.json({
      message:
        "Profile berhasil diupdate",
      user: result.rows[0],
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  profile,
  updateProfile,
};