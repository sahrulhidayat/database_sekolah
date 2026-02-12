import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Menambahkan guru baru
router.post("/", async (req, res) => {
  const {
    nip,
    nama_lengkap,
    tanggal_lahir,
    bidang,
    jenis_kelamin,
    alamat,
    email,
    no_hp,
  } = req.body;
  try {
    const [newGuru] = await db("guru")
      .insert({
        nip,
        nama_lengkap,
        tanggal_lahir,
        bidang,
        jenis_kelamin,
        alamat,
        email,
        no_hp,
      })
      .returning("*");
    res.status(201).json(newGuru);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua guru
router.get("/", async (req, res) => {
  try {
    const result = await db("guru").orderBy("nama_lengkap", "asc");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu guru berdasarkan id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db("guru").where("id_guru", id);
    if (result.length === 0)
      return res.status(404).json({ message: "not found" });
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengubah data guru
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    nip,
    nama_lengkap,
    tanggal_lahir,
    bidang,
    jenis_kelamin,
    alamat,
    email,
    no_hp,
  } = req.body;

  try {
    const [updatedGuru] = await db("guru")
      .where("id_guru", id)
      .update({
        nip,
        nama_lengkap,
        tanggal_lahir,
        bidang,
        jenis_kelamin,
        alamat,
        email,
        no_hp,
      })
      .returning("*");
    if (!updatedGuru) return res.status(404).json({ message: "not found" });
    res.json(updatedGuru);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus guru
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const [deletedGuru] = await db("guru")
      .where("id_guru", id)
      .del()
      .returning("*");
    if (!deletedGuru) return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted successfully", deleted: deletedGuru });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
