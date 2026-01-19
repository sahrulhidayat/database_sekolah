import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan nilai baru
router.post("/", async (req, res) => {
  const { id_siswa, id_mapel, id_kelas, nilai_angka, semester, tahun_ajaran, tanggal_input } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO nilai (id_siswa, id_mapel, id_kelas, nilai_angka, semester, tahun_ajaran, tanggal_input) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id_siswa, id_mapel, id_kelas, nilai_angka, semester, tahun_ajaran, tanggal_input]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua nilai
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM nilai ORDER BY tanggal_input DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu nilai berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM nilai WHERE id_nilai = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengubah data nilai
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_siswa, id_mapel, id_kelas, nilai_angka, semester, tahun_ajaran, tanggal_input } = req.body;
  try {
    const result = await pool.query(
      "UPDATE nilai SET id_siswa = $1, id_mapel = $2, id_kelas = $3, nilai_angka = $4, semester = $5, tahun_ajaran = $6, tanggal_input = $7 WHERE id_nilai = $8 RETURNING *",
      [id_siswa, id_mapel, id_kelas, nilai_angka, semester, tahun_ajaran, tanggal_input, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus nilai
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM nilai WHERE id_nilai = $1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;