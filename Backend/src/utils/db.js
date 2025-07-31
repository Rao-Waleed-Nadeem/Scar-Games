// src/utils/db.js
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT), // 👈 Add this
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("✅ Connected to the SQL Server");
  } catch (err) {
    console.error("❌ Error connecting to SQL Server:", err.message);
  }
};

sql.on("error", (err) => {
  console.error("SQL Error:", err);
});

export { sql }; // So you can use `sql.request()` in your routes
