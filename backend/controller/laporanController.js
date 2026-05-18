const pool = require("../config/db");

// ==========================
// GET SEMUA LAPORAN
// ==========================
const getLaporan = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        laporan_masyarakat.*,
        kategori.category_name,
        users.username,

        COUNT(DISTINCT suka.id)::INT AS total_like,
        COUNT(DISTINCT komentar.id)::INT AS total_komen

      FROM laporan_masyarakat

      JOIN kategori
      ON laporan_masyarakat.kategori_id = kategori.id

      JOIN users
      ON laporan_masyarakat.user_id = users.id

      LEFT JOIN suka
      ON laporan_masyarakat.id = suka.laporan_id

      LEFT JOIN komentar
      ON laporan_masyarakat.id = komentar.laporan_id

      GROUP BY
        laporan_masyarakat.id,
        kategori.category_name,
        users.username

      ORDER BY laporan_masyarakat.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// GET DETAIL LAPORAN
// ==========================
const getDetailLaporan = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        laporan_masyarakat.*,
        kategori.category_name,
        users.username,

        COUNT(DISTINCT suka.id)::INT AS total_like,
        COUNT(DISTINCT komentar.id)::INT AS total_komen

      FROM laporan_masyarakat

      JOIN kategori
      ON laporan_masyarakat.kategori_id = kategori.id

      JOIN users
      ON laporan_masyarakat.user_id = users.id

      LEFT JOIN suka
      ON laporan_masyarakat.id = suka.laporan_id

      LEFT JOIN komentar
      ON laporan_masyarakat.id = komentar.laporan_id

      WHERE laporan_masyarakat.id = $1

      GROUP BY
        laporan_masyarakat.id,
        kategori.category_name,
        users.username
      `,
      [id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// CREATE LAPORAN
// ==========================
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
      (
        judul_laporan,
        isi_laporan,
        gambar,
        tanggal_kejadian,
        lokasi_kejadian,
        user_id,
        kategori_id
      )

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

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// LAPORAN TERKINI (PUBLIC)
// ==========================
const getLaporanFeed = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        laporan_masyarakat.*,
        kategori.category_name,
        users.username,

        COUNT(DISTINCT suka.id)::INT AS total_like,
        COUNT(DISTINCT komentar.id)::INT AS total_komen

      FROM laporan_masyarakat

      JOIN kategori
      ON laporan_masyarakat.kategori_id = kategori.id

      JOIN users
      ON laporan_masyarakat.user_id = users.id

      LEFT JOIN suka
      ON laporan_masyarakat.id = suka.laporan_id

      LEFT JOIN komentar
      ON laporan_masyarakat.id = komentar.laporan_id

      GROUP BY
      laporan_masyarakat.id,
      kategori.category_name,
      users.username

      ORDER BY laporan_masyarakat.created_at DESC

      LIMIT 50
    `);

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// RIWAYAT USER LOGIN
// ==========================
const getRiwayatUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        laporan_masyarakat.*,
        kategori.category_name,
        users.username,

        COUNT(DISTINCT suka.id)::INT AS total_like,
        COUNT(DISTINCT komentar.id)::INT AS total_komen

      FROM laporan_masyarakat

      JOIN kategori
      ON laporan_masyarakat.kategori_id = kategori.id

      JOIN users
      ON laporan_masyarakat.user_id = users.id

      LEFT JOIN suka
      ON laporan_masyarakat.id = suka.laporan_id

      LEFT JOIN komentar
      ON laporan_masyarakat.id = komentar.laporan_id

      WHERE laporan_masyarakat.user_id = $1

      GROUP BY
      laporan_masyarakat.id,
      kategori.category_name,
      users.username

      ORDER BY laporan_masyarakat.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// LIKE / UNLIKE LAPORAN
// ==========================
const likeLaporan = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { laporan_id } = req.body;

    // ==========================
    // CEK SUDAH LIKE ATAU BELUM
    // ==========================
    const cek = await pool.query(
      `
      SELECT * FROM suka
      WHERE user_id = $1
      AND laporan_id = $2
      `,
      [user_id, laporan_id]
    );

    // ==========================
    // UNLIKE
    // ==========================
    if (cek.rows.length > 0) {

      await pool.query(
        `
        DELETE FROM suka
        WHERE user_id = $1
        AND laporan_id = $2
        `,
        [user_id, laporan_id]
      );

      return res.json({
        message: "Unlike berhasil",
        liked: false,
      });
    }

    // ==========================
    // LIKE
    // ==========================
    await pool.query(
      `
      INSERT INTO suka
      (user_id, laporan_id)

      VALUES ($1, $2)
      `,
      [user_id, laporan_id]
    );

    res.json({
      message: "Like berhasil",
      liked: true,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getLaporan,
  getDetailLaporan,
  createLaporan,
  getLaporanFeed,
  getRiwayatUser,
  likeLaporan,
};