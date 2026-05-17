const express = require("express");
const router = express.Router();

const {
  createKomentar,
  getKomentarByLaporan,
} = require("../controller/komentarController");

// TAMBAH KOMENTAR
router.post("/", createKomentar);

// GET KOMENTAR BERDASARKAN LAPORAN
router.get(
  "/laporan/:laporan_id",
  getKomentarByLaporan
);

module.exports = router;