const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
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

    // insert user
    await pool.query(
      `
      INSERT INTO users(username, email, password, role)
      VALUES($1,$2,$3,$4)
      `,
      [username, email, hashedPassword, "user"]
    );

    res.status(201).json({
      message: "Register berhasil",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek user
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // cek password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // response token only
    res.json({
      message: "Login berhasil",
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PROFILE
const profile = async (req, res) => {
  try {

    const user = await pool.query(
      `
      SELECT id, username, email, role
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      user: user.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  profile,
};