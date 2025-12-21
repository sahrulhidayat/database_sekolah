import express, { json } from "express";
import { Pool } from "pg";
import { promises as fs } from "fs";
import { join } from "path";
import dotenv from "dotenv";
dotenv.config();

import siswaRoutes from "./routes/siswa.js";

const _required = ["PGHOST", "PGUSER", "PGPASSWORD", "PGDATABASE", "PGPORT"];
_required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: environment variable ${k} is not set`);
  }
});

const app = express();
app.use(json());

export const pool = new Pool({
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

// Routes
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "database-sekolah" });
});
app.use("/siswa", siswaRoutes);


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
