import fs from "fs";
import path from "path";
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

// Use CWD-anchored relative paths so this works regardless of module URL quirks.
const sqlDir = path.join(process.cwd(), "database");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: process.env.DB_DATABASE || "master",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const readSqlFile = (relativeFile) => {
  const filePath = path.join(sqlDir, relativeFile);
  return fs.readFileSync(filePath, "utf8");
};

const run = async () => {
  const pool = await sql.connect(config);
  try {
    const schemaSql = readSqlFile("schema.sql");
    const seedSql = readSqlFile("seed.sql");

    // mssql driver doesn't understand GO separators inside a single batch.
    const stripGo = (sqlText) => sqlText.replace(/\bGO\b\s*\r?\n?/gi, "");

    const schemaSqlStripped = stripGo(schemaSql);
    const seedSqlStripped = stripGo(seedSql);

    console.log("Running schema.sql...");
    await pool.request().batch(schemaSqlStripped);

    console.log("Running seed.sql...");
    await pool.request().batch(seedSqlStripped);

    console.log("✅ Database setup complete");
  } finally {
    pool.close();
  }
};

run().catch((err) => {
  console.error("❌ db:setup failed:", err);
  process.exit(1);
});
