const pool = require("../config/db");

// ======================================
// TOGGLE LIKE / DUKUNG LAPORAN
// ======================================
const toggleLikeLaporan = async (req, res) => {
  try {

    const laporan_id = req.params.id;

    const user_id = req.user.id;

    // ==========================
    // CEK SUDAH LIKE ATAU BELUM
    // ==========================
    const check = await pool.query(
      `
      SELECT * FROM suka
      WHERE laporan_id = $1
      AND user_id = $2
      `,
      [laporan_id, user_id]
    );

    // ==========================
    // JIKA SUDAH LIKE
    // ==========================
    if (check.rows.length > 0) {

      await pool.query(
        `
        DELETE FROM suka
        WHERE laporan_id = $1
        AND user_id = $2
        `,
        [laporan_id, user_id]
      );

      return res.json({
        liked: false,
        message: "Dukungan dihapus",
      });
    }

    // ==========================
    // JIKA BELUM LIKE
    // ==========================
    await pool.query(
      `
      INSERT INTO suka
      (laporan_id, user_id)
      VALUES ($1, $2)
      `,
      [laporan_id, user_id]
    );

    res.json({
      liked: true,
      message: "Berhasil mendukung laporan",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  toggleLikeLaporan,
};