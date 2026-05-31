const express = require("express");
const router = express.Router();

const {
  getLaporan,
  getDetailLaporan,
  createLaporan,
  getLaporanFeed,
  getRiwayatUser,
  updateStatusLaporan,
   deleteLaporan,
} = require("../controller/laporanController");

const {
  toggleLikeLaporan,
} = require("../controller/likeController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// ==========================
// PUBLIC FEED
// ==========================
router.get(
  "/feed",
  getLaporanFeed
);

// ==========================
// RIWAYAT USER LOGIN
// ==========================
router.get(
  "/riwayat",
  authMiddleware,
  getRiwayatUser
);

// ==========================
// LIKE / UNLIKE LAPORAN
// ==========================
router.post(
  "/:id/like",
  authMiddleware,
  toggleLikeLaporan
);

// ==========================
// DETAIL LAPORAN
// ==========================
router.get(
  "/:id",
  getDetailLaporan
);

// ==========================
// UPDATE STATUS ADMIN
// ==========================
router.put(
  "/:id/status",
  authMiddleware,
  updateStatusLaporan
);

// ==========================
// SEMUA LAPORAN
// ==========================
router.get(
  "/",
  getLaporan
);

// ==========================
// CREATE LAPORAN
// ==========================
router.post(
  "/",
  authMiddleware,
  upload.single("gambar"),
  createLaporan
);

// ==========================
// DELETE LAPORAN
// ==========================
router.delete(
  "/:id",
  authMiddleware,
  deleteLaporan
);

module.exports = router;