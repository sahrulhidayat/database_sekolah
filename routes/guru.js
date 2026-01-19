import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan guru baru
router.post("/", async (req, res) => {
  const {
    nip,
    nama_lengkap,
    tanggal_lahir,
    bidang,
    jenis_kelamin,
    alamat,
    email,
    no_hp,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO guru (nip, nama_lengkap, tanggal_lahir, bidang, jenis_kelamin, alamat, email, no_hp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [nip, nama_lengkap, tanggal_lahir, bidang, jenis_kelamin, alamat, email, no_hp]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua guru
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM guru ORDER BY nama_lengkap ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu guru berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM guru WHERE id_guru = $1", [
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

// Mengubah data guru
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nip,
    nama_lengkap,
    tanggal_lahir,
    bidang,
    jenis_kelamin,
    alamat,
    email,
    no_hp,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE guru SET nip = $1, nama_lengkap = $2, tanggal_lahir = $3, bidang = $4, jenis_kelamin = $5, alamat = $6, email = $7, no_hp = $8 WHERE id_guru = $9 RETURNING *",
      [
        nip,
        nama_lengkap,
        tanggal_lahir,
        bidang,
        jenis_kelamin,
        alamat,
        email,
        no_hp,
        id,
      ]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus guru
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM guru WHERE id_guru = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json({ message: "Guru berhasil dihapus", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
