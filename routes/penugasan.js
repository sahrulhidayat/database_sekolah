import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan penugasan mengajar baru
router.post("/", async (req, res) => {
  const { id_guru, id_mapel, id_kelas, tahun_ajaran } = req.body;
    try {
    const result = await pool.query(
      "INSERT INTO penugasan_mengajar (id_guru, id_mapel, id_kelas, tahun_ajaran) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_guru, id_mapel, id_kelas, tahun_ajaran]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua penugasan mengajar
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM penugasan_mengajar ORDER BY tahun_ajaran DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu penugasan mengajar berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM penugasan_mengajar WHERE id_penugasan = $1", [
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

// Mengubah data penugasan mengajar
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_guru, id_mapel, id_kelas, tahun_ajaran } = req.body;
  try {
    const result = await pool.query(
      "UPDATE penugasan_mengajar SET id_guru = $1, id_mapel = $2, id_kelas = $3, tahun_ajaran = $4 WHERE id_penugasan = $5 RETURNING *",
      [id_guru, id_mapel, id_kelas, tahun_ajaran, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus penugasan mengajar
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM penugasan_mengajar WHERE id_penugasan = $1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;