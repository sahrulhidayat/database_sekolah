import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Menambahkan nilai baru
router.post("/", async (req, res) => {
  const {
    id_siswa,
    id_mapel,
    id_kelas,
    nilai_angka,
    semester,
    tahun_ajaran,
    tanggal_input,
  } = req.body;
  try {
    const [newNilai] = await db("nilai")
      .insert({
        id_siswa,
        id_mapel,
        id_kelas,
        nilai_angka,
        semester,
        tahun_ajaran,
        tanggal_input,
      })
      .returning("*");
    res.status(201).json(newNilai);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua nilai
router.get("/", async (req, res) => {
  try {
    const result = await db("nilai").orderBy("tanggal_input", "desc");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu nilai berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("nilai").where("id_nilai", id);
    if (result.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengubah data nilai
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_siswa,
    id_mapel,
    id_kelas,
    nilai_angka,
    semester,
    tahun_ajaran,
    tanggal_input,
  } = req.body;
  try {
    const [updatedNilai] = await db("nilai")
      .where("id_nilai", id)
      .update({
        id_siswa,
        id_mapel,
        id_kelas,
        nilai_angka,
        semester,
        tahun_ajaran,
        tanggal_input,
      })
      .returning("*");
    if (!updatedNilai) return res.status(404).json({ message: "not found" });
    res.json(updatedNilai);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus nilai
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedNilai] = await db("nilai")
      .where("id_nilai", id)
      .del()
      .returning("*");
    if (!deletedNilai) return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted successfully", deleted: deletedNilai });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
