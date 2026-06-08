const express = require("express");
const router = express.Router();

const {
  createKomentar,
  getKomentarByLaporan,
  deleteKomentar,
  updateKomentar,
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

// UPDATE KOMENTAR
router.put(
  "/:id",
  authMiddleware,
  updateKomentar
);

module.exports = router;