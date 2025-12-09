const express = require("express");
const { Pool } = require("pg");
const fs = require("fs").promises;
const path = require("path");

const _required = ["PGHOST", "PGUSER", "PGPASSWORD", "PGDATABASE", "PGPORT"];
_required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: environment variable ${k} is not set`);
  }
});

require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Initialize DB: create table if not exists
async function initDb() {
  const schemaPath = path.join(__dirname, "schema.sql");
  try {
    const sql = await fs.readFile(schemaPath, "utf8");
    // Execute the SQL from schema.sql (can contain multiple statements)
    await pool.query(sql);
    console.log(`Database schema loaded from ${schemaPath}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(
        `schema.sql not found at ${schemaPath}, skipping schema initialization.`
      );
    } else {
      throw err;
    }
  }
}

// Routes
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "database-sekolah" });
});

// List siswa
app.get("/siswa", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM siswa ORDER BY nama_lengkap ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Get siswa by id
app.get("/siswa/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query("SELECT * FROM siswa WHERE id_siswa = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Create siswa
app.post("/siswa", async (req, res) => {
  const { nisn, name, birthDate, gender, address, isActive, entryYear, classId } =
    req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  try {
    const result = await pool.query(
      "INSERT INTO siswa (nisn, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, id_kelas, status_aktif, tahun_masuk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        nisn,
        name,
        birthDate || null,
        gender || null,
        address || null,
        classId || null,
        isActive || true,
        entryYear || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Update siswa
app.put("/siswa/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, birthDate, classId } = req.body;
  try {
    const result = await pool.query(
      `UPDATE siswa SET
                 nama_lengkap = COALESCE($1, nama_lengkap),
                 tanggal_lahir = COALESCE($2, tanggal_lahir),
                 id_kelas = COALESCE($3, id_kelas)
             WHERE id_siswa = $4
             RETURNING *`,
      [name, birthDate, classId, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Delete siswa
app.delete("/siswa/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      "DELETE FROM siswa WHERE id_siswa = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "not found" });
    res.json({ deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Start server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
    process.exit(1);
  });
