import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// Menambahkan user baru
router.post("/", async (req, res) => {
  const { username, password_hash, role, id_guru, id_siswa } = req.body;
  try {
    const [newUser] = await db("users")
      .insert({
        username,
        password_hash,
        role,
        id_guru,
        id_siswa,
      })
      .returning("*");
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses semua user
router.get("/", async (req, res) => {
  try {
    const result = await db("users").orderBy("id_user");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Mengakses satu user berdasarkan id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db("users").where("id_user", id);
    if (result.length === 0)
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
    const [updatedUser] = await db("users")
      .where("id_user", id)
      .update({
        username,
        password_hash,
        role,
        id_guru,
        id_siswa,
      })
      .returning("*");
    if (!updatedUser) return res.status(404).json({ message: "not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Menghapus user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [deletedUser] = await db("users")
      .where("id_user", id)
      .del()
      .returning("*");
    if (!deletedUser) return res.status(404).json({ message: "not found" });
    res.json({
      message: "deleted successfully",
      deleted: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

export default router;
