const pool = require("../config/db");

const getKategori = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM kategori ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal mengambil kategori",
    });
  }
};

module.exports = {
  getKategori,
};