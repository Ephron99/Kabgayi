const mysql = require("mysql2/promise");
const path  = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "santech@2019",
  database: process.env.DB_NAME     || "kabgayi",
  waitForConnections: true,
  connectionLimit:    10,
  charset: "utf8mb4",
});

pool.getConnection()
  .then((conn) => {
    console.log("  MySQL connected — database:", process.env.DB_NAME || "kabgayi");
    conn.release();
  })
  .catch((err) => {
    console.error("  MySQL connection failed:", err.message);
  });

module.exports = pool;
