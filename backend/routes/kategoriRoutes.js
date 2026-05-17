const express = require("express");
const router = express.Router();

const {
  getKategori,
} = require("../controller/kategoriController");

router.get("/", getKategori);

module.exports = router;