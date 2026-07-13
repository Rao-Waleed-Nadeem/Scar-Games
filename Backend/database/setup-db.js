import fs from "fs";
import path from "path";
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlDir = path.join(process.cwd(), "database");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: "master",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const readSqlFile = (relativeFile) => {
  const filePath = path.join(sqlDir, relativeFile);
  return fs.readFileSync(filePath, "utf8");
};

// Split into individual batches on standalone GO lines, and run each in order.
const splitBatches = (sqlText) =>
  sqlText
    .split(/^\s*GO\s*$/im)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

const runBatches = async (pool, sqlText, label) => {
  const batches = splitBatches(sqlText);
  for (let i = 0; i < batches.length; i++) {
    console.log(`  ${label} batch ${i + 1}/${batches.length}...`);
    await pool.request().batch(batches[i]);
  }
};

const run = async () => {
  const pool = await sql.connect(config);
  try {
    const schemaSql = readSqlFile("schema.sql");
    const seedSql = readSqlFile("seed.sql");

    console.log("Running schema.sql...");
    await runBatches(pool, schemaSql, "schema");

    console.log("Running seed.sql...");
    await runBatches(pool, seedSql, "seed");

    console.log("✅ Database setup complete");
  } finally {
    pool.close();
  }
};

run().catch((err) => {
  console.error("❌ db:setup failed:", err);
  process.exit(1);
});
