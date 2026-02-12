import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Menambahkan mata pelajaran baru
router.post("/", async (req, res) => {
  const { kode_mapel, nama_mapel, kkm } = req.body;
  try {
    const [newMapel] = await db("mata_pelajaran")
      .insert({ kode_mapel, nama_mapel, kkm })
      .returning("*");
    res.status(201).json(newMapel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua mata pelajaran
router.get("/", async (req, res) => {
  try {
    const result = await db("mata_pelajaran").orderBy("nama_mapel", "asc");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu mata pelajaran berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("mata_pelajaran").where("id_mapel", id);
    if (result.length === 0)
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
    const [updatedMapel] = await db("mata_pelajaran")
      .where("id_mapel", id)
      .update({ nama_mapel, kkm })
      .returning("*");
    if (!updatedMapel) return res.status(404).json({ message: "not found" });
    res.json(updatedMapel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus mata pelajaran
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedMapel] = await db("mata_pelajaran")
      .where("id_mapel", id)
      .del()
      .returning("*");
    if (!deletedMapel) return res.status(404).json({ message: "not found" });
    res.json({
      message: "deleted successfully",
      deleted: deletedMapel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
