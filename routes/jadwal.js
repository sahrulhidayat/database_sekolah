import { Router } from "express";
import { db } from "../db.js";

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
    const [newJadwal] = await db("jadwal")
      .insert({
        id_kelas,
        id_mapel,
        id_guru,
        hari,
        waktu_mulai,
        waktu_selesai,
        ruangan,
        tahun_ajaran,
      })
      .returning("*");
    res.status(201).json(newJadwal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua jadwal
router.get("/", async (req, res) => {
  try {
    const result = await db("jadwal")
      .orderBy("hari", "asc")
      .orderBy("waktu_mulai", "asc");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu jadwal berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("jadwal").where("id_jadwal", id);
    if (result.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result[0]);
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
    const [updatedJadwal] = await db("jadwal")
      .where("id_jadwal", id)
      .update({
        id_kelas,
        id_mapel,
        id_guru,
        hari,
        waktu_mulai,
        waktu_selesai,
        ruangan,
        tahun_ajaran,
      })
      .returning("*");
    if (!updatedJadwal) return res.status(404).json({ message: "not found" });
    res.json(updatedJadwal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus jadwal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedJadwal] = await db("jadwal")
      .where("id_jadwal", id)
      .del()
      .returning("*");
    if (!deletedJadwal) return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted successfully", deleted: deletedJadwal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
