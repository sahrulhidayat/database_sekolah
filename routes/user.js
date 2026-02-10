import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Menambahkan user baru
router.post("/", async (req, res) => {
  const { username, password_hash, role, id_guru, id_siswa } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password_hash, role, id_guru, id_siswa) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [username, password_hash, role, id_guru, id_siswa],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua user
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id_user");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu user berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
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

// Mengubah data user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password_hash, role, id_guru, id_siswa } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET username = $1, password_hash = $2, role = $3, id_guru = $4, id_siswa = $5 WHERE id_user = $6 RETURNING *",
      [username, password_hash, role, id_guru, id_siswa, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id_user = $1 RETURNING *",
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
