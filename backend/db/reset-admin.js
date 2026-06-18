/**
 * RESET ADMIN PASSWORD
 * Run: node db/reset-admin.js
 * Resets the superadmin password to Admin@Kabgayi2024
 */
require("dotenv").config();
const mysql  = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function reset() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "kabgayi",
  });

  const email    = "admin@diocesedekabgayi.org";
  const password = "Admin@Kabgayi2024";
  const hash     = await bcrypt.hash(password, 10);

  // Upsert — works whether user exists or not
  await conn.query(
    `INSERT INTO admin_users (name, email, password, role)
     VALUES ('Super Admin', ?, ?, 'superadmin')
     ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'superadmin'`,
    [email, hash]
  );

  console.log("✅  Admin password reset successfully");
  console.log(`   Email    : ${email}`);
  console.log(`   Password : ${password}`);
  await conn.end();
}

reset().catch((err) => {
  console.error("❌  Error:", err.message);
  console.error("👉  Check DB_PASSWORD in backend/.env");
  process.exit(1);
});
