const express = require("express");
const router = express.Router();

const {
  createKomentar,
  getKomentarByLaporan,
  deleteKomentar,
} = require("../controller/komentarController");

const authMiddleware = require("../middleware/authMiddleware");

// GET KOMENTAR
router.get(
  "/laporan/:id",
  getKomentarByLaporan
);

// CREATE KOMENTAR
router.post(
  "/",
  authMiddleware,
  createKomentar
);

// DELETE KOMENTAR
router.delete(
  "/:id",
  authMiddleware,
  deleteKomentar
);

module.exports = router;