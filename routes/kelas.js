import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan kelas baru
router.post('/', async (req, res) => {
  const { nama_kelas, tingkat, id_wali_kelas, tahun_ajaran} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO kelas (nama_kelas, tingkat, id_wali_kelas, tahun_ajaran) VALUES ($1, $2, $3, $4) RETURNING *',
      [nama_kelas, tingkat, id_wali_kelas, tahun_ajaran]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua kelas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kelas ORDER BY nama_kelas ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu kelas berdasarkan id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM kelas WHERE id_kelas = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengubah data kelas
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_kelas, tingkat, id_wali_kelas, tahun_ajaran } = req.body;
  try {
    const result = await pool.query(
      'UPDATE kelas SET nama_kelas = $1, tingkat = $2, id_wali_kelas = $3, tahun_ajaran = $4 WHERE id_kelas = $5 RETURNING *',
      [nama_kelas, tingkat, id_wali_kelas, tahun_ajaran, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus kelas
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM kelas WHERE id_kelas = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Kelas tidak ditemukan" });
    res.json({ message: "Kelas berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;