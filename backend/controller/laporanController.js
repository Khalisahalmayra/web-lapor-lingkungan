const pool = require("../config/db");

// GET SEMUA LAPORAN
const getLaporan = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        laporan_masyarakat.*,
        kategori.category_name,
        users.username
      FROM laporan_masyarakat
      JOIN kategori ON laporan_masyarakat.kategori_id = kategori.id
      JOIN users ON laporan_masyarakat.user_id = users.id
      ORDER BY laporan_masyarakat.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET DETAIL LAPORAN
const getDetailLaporan = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        laporan_masyarakat.*,
        kategori.category_name,
        users.username
      FROM laporan_masyarakat
      JOIN kategori ON laporan_masyarakat.kategori_id = kategori.id
      JOIN users ON laporan_masyarakat.user_id = users.id
      WHERE laporan_masyarakat.id = $1
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔥 CREATE LAPORAN (INI DIPISAH)
const createLaporan = async (req, res) => {
  try {
    const {
      judul_laporan,
      isi_laporan,
      gambar,
      tanggal_kejadian,
      lokasi_kejadian,
      kategori_id,
    } = req.body;

    const user_id = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO laporan_masyarakat
      (judul_laporan, isi_laporan, gambar, tanggal_kejadian, lokasi_kejadian, user_id, kategori_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        judul_laporan,
        isi_laporan,
        gambar,
        tanggal_kejadian,
        lokasi_kejadian,
        user_id,
        kategori_id,
      ]
    );

    res.json({
      message: "Laporan berhasil dibuat",
      data: result.rows[0],
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLaporan,
  getDetailLaporan,
  createLaporan,
};