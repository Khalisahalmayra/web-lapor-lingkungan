const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const komentarRoutes = require("./routes/komentarRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/komentar", komentarRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});