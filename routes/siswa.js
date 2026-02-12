import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Get all siswa
router.get("/", async (req, res) => {
  try {
    const result = await db("siswa").orderBy("nama_lengkap", "asc");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Get siswa by id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db("siswa").where("id_siswa", id);
    if (result.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Create siswa
router.post("/", async (req, res) => {
  const {
    nisn,
    nama_lengkap,
    tanggal_lahir,
    jenis_kelamin,
    alamat,
    status_aktif,
    tahun_masuk,
    id_kelas,
  } = req.body;

  if (!nama_lengkap)
    return res.status(400).json({ error: "Nama lengkap wajib diisi" });

  try {
    const [newSiswa] = await db("siswa")
      .insert({
        nisn,
        nama_lengkap,
        tanggal_lahir: tanggal_lahir || null,
        jenis_kelamin: jenis_kelamin || null,
        alamat: alamat || null,
        id_kelas: id_kelas || null,
        status_aktif: status_aktif !== undefined ? status_aktif : true,
        tahun_masuk: tahun_masuk || null,
      })
      .returning("*");
    res.status(201).json(newSiswa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Update siswa
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nama_lengkap, tanggal_lahir, id_kelas } = req.body;
  try {
    const [updatedSiswa] = await db("siswa")
      .where("id_siswa", id)
      .update({ nama_lengkap, tanggal_lahir, id_kelas })
      .returning("*");
    if (!updatedSiswa) return res.status(404).json({ error: "not found" });
    res.json(updatedSiswa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Delete siswa
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const [deletedSiswa] = await db("siswa")
      .where("id_siswa", id)
      .del()
      .returning("*");
    if (!deletedSiswa) return res.status(404).json({ error: "not found" });
    res.json({ message: "deleted successfully", deleted: deletedSiswa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
