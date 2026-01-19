import express, { json } from "express";
import { promises as fs } from "fs";
import { join } from "path";
import { pool } from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());

// Initialize DB: create table if not exists
async function initDb() {
  const schemaPath = join(process.cwd(), "schema.sql");
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

import siswaRoutes from "./routes/siswa.js";
import kelasRoutes from "./routes/kelas.js";
import guruRoutes from "./routes/guru.js";
import jadwalRoutes from "./routes/jadwal.js";
import mapelRoutes from "./routes/mapel.js";
import penugasanRoutes from "./routes/penugasan.js";
import nilaiRoutes from "./routes/nilai.js";
import userRoutes from "./routes/user.js";

// Routes
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "database-sekolah" });
});
app.use("/siswa", siswaRoutes);
app.use("/kelas", kelasRoutes);
app.use("/guru", guruRoutes);
app.use("/jadwal", jadwalRoutes);
app.use("/mapel", mapelRoutes);
app.use("/penugasan", penugasanRoutes);
app.use("/nilai", nilaiRoutes);
app.use("/user", userRoutes);


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
