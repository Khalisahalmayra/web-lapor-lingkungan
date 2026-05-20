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

// =========================
// DELETE KOMENTAR (HANYA PEMILIK)
// =========================
const deleteKomentar = async (req, res) => {
  try {
    const { id } = req.params; // id komentar
    const user_id = req.user.id;

    // cek apakah komentar milik user
    const checkQuery = `
      SELECT * FROM komentar WHERE id = $1
    `;

    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Komentar tidak ditemukan",
      });
    }

    const komentar = checkResult.rows[0];

    if (komentar.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Tidak bisa menghapus komentar orang lain",
      });
    }

    // delete
    await db.query(`DELETE FROM komentar WHERE id = $1`, [
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Komentar berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus komentar",
    });
  }
};

module.exports = {
  createKomentar,
  getKomentarByLaporan,
  deleteKomentar,
};