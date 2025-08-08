import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chat_app",
  password: "your password",
  port: 5432,
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err: Error) => {
  console.error("❌ Unexpected PostgreSQL error", err);
  process.exit(-1);
});

export default pool;
