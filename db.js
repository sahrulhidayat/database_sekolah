import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const _required = ["PGHOST", "PGUSER", "PGPASSWORD", "PGDATABASE", "PGPORT"];
_required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: environment variable ${k} is not set`);
  }
});


const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 10,
  idleTimeoutMillis: 30000,
});

export { pool };