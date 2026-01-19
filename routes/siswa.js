import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Get all siswa
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM siswa ORDER BY nama_lengkap ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Get siswa by id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query("SELECT * FROM siswa WHERE id_siswa = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Create siswa
router.post("/", async (req, res) => {
  const {
    nisn,
    nama_lengkap,
    tanggal_lahir,
    jenis_kelamin,
    alamat,
    status_aktif,
    tahun_masuk,
    id_kelas,
  } = req.body;

  if (!nama_lengkap)
    return res.status(400).json({ error: "Nama lengkap wajib diisi" });

  try {
    const result = await pool.query(
      "INSERT INTO siswa (nisn, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, id_kelas, status_aktif, tahun_masuk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        nisn,
        nama_lengkap,
        tanggal_lahir || null,
        jenis_kelamin || null,
        alamat || null,
        id_kelas || null,
        status_aktif || true,
        tahun_masuk || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Update siswa
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nama_lengkap, tanggal_lahir, id_kelas } = req.body;
  try {
    const result = await pool.query(
      `UPDATE siswa SET
                 nama_lengkap = COALESCE($1, nama_lengkap),
                 tanggal_lahir = COALESCE($2, tanggal_lahir),
                 id_kelas = COALESCE($3, id_kelas)
             WHERE id_siswa = $4
             RETURNING *`,
      [nama_lengkap, tanggal_lahir, id_kelas, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Delete siswa
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      "DELETE FROM siswa WHERE id_siswa = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json({ message: "Siswa berhasil dihapus", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
