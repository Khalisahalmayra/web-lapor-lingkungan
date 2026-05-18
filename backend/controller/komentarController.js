const db = require("../config/db");

// =========================
// CREATE KOMENTAR
// =========================
const createKomentar = async (req, res) => {
  try {

    const {
      isi_komentar,
      laporan_id,
    } = req.body;

    // user dari token
    const user_id = req.user.id;

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
      message: "Komentar berhasil dibuat",
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

    // HARUS id
    const { id } = req.params;

    const query = `
      SELECT
        komentar.*,
        users.username,
        users.profile
      FROM komentar

      JOIN users
      ON users.id = komentar.user_id

      WHERE komentar.laporan_id = $1

      ORDER BY komentar.created_at DESC
    `;

    const result = await db.query(
      query,
      [id]
    );

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