const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token tidak ada",
      });
    }

    // =========================
    // CEK FORMAT BEARER
    // =========================
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Format token salah",
      });
    }

    const token = parts[1];

    // =========================
    // VERIFY TOKEN
    // =========================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    // =========================
    // TOKEN EXPIRED
    // =========================
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, silakan login ulang",
      });
    }

    // =========================
    // INVALID TOKEN
    // =========================
    return res.status(403).json({
      message: "Token tidak valid",
    });
  }
};

module.exports = authMiddleware;