/**
 * Migration: Add pastoral_items table
 * Run: node db/migrate-pastoral.js
 */
require("dotenv").config();
const mysql = require("mysql2/promise");

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "kabgayi",
  });
  console.log("✅  Connected");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS pastoral_items (
      id                  INT AUTO_INCREMENT PRIMARY KEY,
      parent_id           INT NULL,
      slug                VARCHAR(100) NOT NULL UNIQUE,
      name_fr             VARCHAR(200) NOT NULL,
      name_en             VARCHAR(200),
      name_rw             VARCHAR(200),
      image_url           VARCHAR(500),
      moto_fr             TEXT,
      moto_en             TEXT,
      moto_rw             TEXT,
      saint_patron_fr     VARCHAR(200),
      saint_patron_en     VARCHAR(200),
      saint_patron_rw     VARCHAR(200),
      date_fondation      DATE,
      directeur_name_fr   VARCHAR(200),
      directeur_name_en   VARCHAR(200),
      directeur_name_rw   VARCHAR(200),
      directeur_contact   VARCHAR(200),
      sort_order          INT DEFAULT 0,
      is_active           TINYINT(1) DEFAULT 1,
      created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES pastoral_items(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  pastoral_items table ready");

  await conn.end();
  console.log("\n🎉  Migration complete!");
}
migrate().catch((e) => { console.error("❌", e.message); process.exit(1); });