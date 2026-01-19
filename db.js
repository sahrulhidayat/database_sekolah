import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const _required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_PORT"];
_required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: environment variable ${k} is not set`);
  }
});


const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
});

export { pool };