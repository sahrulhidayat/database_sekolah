import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Menambahkan kelas baru
router.post("/", async (req, res) => {
  const { nama_kelas, tingkat, id_wali_kelas, tahun_ajaran } = req.body;

  try {
    const [newKelas] = await db("kelas")
      .insert({ nama_kelas, tingkat, id_wali_kelas, tahun_ajaran })
      .returning("*");
    res.status(201).json(newKelas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua kelas
router.get("/", async (req, res) => {
  try {
    const result = await db("kelas").orderBy("nama_kelas", "asc");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu kelas berdasarkan id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db("kelas").where("id_kelas", id);
    if (result.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengubah data kelas
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nama_kelas, tingkat, id_wali_kelas, tahun_ajaran } = req.body;
  try {
    const [updatedKelas] = await db("kelas")
      .where("id_kelas", id)
      .update({ nama_kelas, tingkat, id_wali_kelas, tahun_ajaran })
      .returning("*");
    if (!updatedKelas) return res.status(404).json({ message: "not found" });
    res.json(updatedKelas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus kelas
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const [deletedKelas] = await db("kelas")
      .where("id_kelas", id)
      .del()
      .returning("*");
    if (!deletedKelas) return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted successfully", deleted: deletedKelas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
