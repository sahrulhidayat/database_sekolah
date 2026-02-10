import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan jadwal baru
router.post("/", async (req, res) => {
  const {
    id_kelas,
    id_mapel,
    id_guru,
    hari,
    waktu_mulai,
    waktu_selesai,
    ruangan,
    tahun_ajaran,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO jadwal (id_kelas, id_mapel, id_guru, hari, waktu_mulai, waktu_selesai, ruangan, tahun_ajaran) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        id_kelas,
        id_mapel,
        id_guru,
        hari,
        waktu_mulai,
        waktu_selesai,
        ruangan,
        tahun_ajaran,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua jadwal
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM jadwal ORDER BY hari, waktu_mulai",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu jadwal berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM jadwal WHERE id_jadwal = $1",
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengubah data jadwal
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_kelas,
    id_mapel,
    id_guru,
    hari,
    waktu_mulai,
    waktu_selesai,
    ruangan,
    tahun_ajaran,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE jadwal SET id_kelas = $1, id_mapel = $2, id_guru = $3, hari = $4, waktu_mulai = $5, waktu_selesai = $6, ruangan = $7, tahun_ajaran = $8 WHERE id_jadwal = $9 RETURNING *",
      [
        id_kelas,
        id_mapel,
        id_guru,
        hari,
        waktu_mulai,
        waktu_selesai,
        ruangan,
        tahun_ajaran,
        id,
      ],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus jadwal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM jadwal WHERE id_jadwal = $1 RETURNING *",
      [id],
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
