const db = require("../config/db");

// =========================
// CREATE KOMENTAR
// =========================
const createKomentar = async (req, res) => {
  try {
    const {
      isi_komentar,
      user_id,
      laporan_id,
    } = req.body;

    const query = `
      INSERT INTO komentar
      (
        isi_komentar,
        user_id,
        laporan_id
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [
      isi_komentar,
      user_id,
      laporan_id,
    ];

    const result = await db.query(
      query,
      values
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Gagal menambah komentar",
    });
  }
};

// =========================
// GET KOMENTAR BERDASARKAN LAPORAN
// =========================
const getKomentarByLaporan = async (
  req,
  res
) => {
  try {
    const { laporan_id } = req.params;

    const query = `
      SELECT
        komentar.*,
        users.username
      FROM komentar
      JOIN users
        ON users.id = komentar.user_id
      WHERE laporan_id = $1
      ORDER BY komentar.created_at DESC
    `;

    const result = await db.query(query, [
      laporan_id,
    ]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil komentar",
    });
  }
};

module.exports = {
  createKomentar,
  getKomentarByLaporan,
};