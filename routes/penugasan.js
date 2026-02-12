import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Menambahkan penugasan mengajar baru
router.post("/", async (req, res) => {
  const { id_guru, id_mapel, id_kelas, tahun_ajaran } = req.body;
  try {
    const [newPenugasan] = await db("penugasan_mengajar")
      .insert({
        id_guru,
        id_mapel,
        id_kelas,
        tahun_ajaran,
      })
      .returning("*");
    res.status(201).json(newPenugasan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua penugasan mengajar
router.get("/", async (req, res) => {
  try {
    const result = await db("penugasan_mengajar").orderBy(
      "tahun_ajaran",
      "desc",
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu penugasan mengajar berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("penugasan_mengajar").where("id_penugasan", id);
    if (result.length === 0)
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
    const [updatedPenugasan] = await db("penugasan_mengajar")
      .where("id_penugasan", id)
      .update({
        id_guru,
        id_mapel,
        id_kelas,
        tahun_ajaran,
      })
      .returning("*");
    if (!updatedPenugasan)
      return res.status(404).json({ message: "not found" });
    res.json(updatedPenugasan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus penugasan mengajar
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedPenugasan] = await db("penugasan_mengajar")
      .where("id_penugasan", id)
      .del()
      .returning("*");
    if (!deletedPenugasan)
      return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted successfully", deleted: deletedPenugasan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
