const express = require("express");
const router = express.Router();

const {
  getLaporan,
  getDetailLaporan,
  createLaporan,
} = require("../controller/laporanController");

const authMiddleware = require("../middleware/authMiddleware");

// GET
router.get("/", getLaporan);
router.get("/:id", getDetailLaporan);

// POST
router.post("/", authMiddleware, createLaporan);

module.exports = router;