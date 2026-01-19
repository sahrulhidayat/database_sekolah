import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan mata pelajaran baru
router.post("/", async (req, res) => {
  const { kode_mapel, nama_mapel, kkm } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO mata_pelajaran (kode_mapel, nama_mapel, kkm) VALUES ($1, $2, $3) RETURNING *",
      [kode_mapel, nama_mapel, kkm]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua mata pelajaran
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM mata_pelajaran ORDER BY nama_mapel ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu mata pelajaran berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM mata_pelajaran WHERE id_mapel = $1", [
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

// Mengubah data mata pelajaran
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nama_mapel, kkm } = req.body;
  try {
    const result = await pool.query(
      "UPDATE mata_pelajaran SET nama_mapel = $1, kkm = $2 WHERE id_mapel = $3 RETURNING *",
      [nama_mapel, kkm, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus mata pelajaran
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM mata_pelajaran WHERE id_mapel = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
