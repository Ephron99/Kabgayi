/**
 * DATABASE SETUP SCRIPT
 * Run: node db/setup.js
 * 
 * Creates database, all tables, and the default admin user.
 * Update DB_PASSWORD in .env before running.
 */

require("dotenv").config();
const mysql  = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const DB_NAME = process.env.DB_NAME || "kabgayi";

async function setup() {
  console.log("🔧  Kabgayi Diocese — Database Setup");
  console.log("=====================================\n");

  // Connect WITHOUT specifying database first (to create it)
  let conn;
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST     || "localhost",
      user:     process.env.DB_USER     || "root",
      password: process.env.DB_PASSWORD || "",
      charset:  "utf8mb4",
    });
    console.log("✅  Connected to MySQL");
  } catch (err) {
    console.error("❌  Cannot connect to MySQL:", err.message);
    console.error("\n👉  Make sure DB_PASSWORD in backend/.env matches your MySQL root password.");
    process.exit(1);
  }

  // Create database
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`✅  Database '${DB_NAME}' ready`);
  await conn.query(`USE \`${DB_NAME}\``);

  // ── Create tables ─────────────────────────────────────────
  const tables = [
    `CREATE TABLE IF NOT EXISTS admin_users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      role       ENUM('superadmin','admin','editor') DEFAULT 'editor',
      avatar     VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS hero_slides (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      badge       VARCHAR(100) NOT NULL,
      image_url   VARCHAR(500) NOT NULL,
      title_fr    VARCHAR(200) NOT NULL,
      title_en    VARCHAR(200),
      title_rw    VARCHAR(200),
      desc_fr     TEXT NOT NULL,
      desc_en     TEXT,
      desc_rw     TEXT,
      points_fr   JSON,
      points_en   JSON,
      points_rw   JSON,
      sort_order  INT DEFAULT 0,
      is_active   TINYINT(1) DEFAULT 1,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS news (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      category_fr  VARCHAR(100),
      category_en  VARCHAR(100),
      category_rw  VARCHAR(100),
      title_fr     VARCHAR(300) NOT NULL,
      title_en     VARCHAR(300),
      title_rw     VARCHAR(300),
      excerpt_fr   TEXT,
      excerpt_en   TEXT,
      excerpt_rw   TEXT,
      content_fr   LONGTEXT,
      content_en   LONGTEXT,
      content_rw   LONGTEXT,
      image_url    VARCHAR(500),
      author_id    INT,
      is_published TINYINT(1) DEFAULT 0,
      published_at DATETIME,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS parishes (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      location    VARCHAR(200),
      vicar       VARCHAR(200),
      phone       VARCHAR(50),
      email       VARCHAR(150),
      image_url   VARCHAR(500),
      description TEXT,
      sort_order  INT DEFAULT 0,
      is_active   TINYINT(1) DEFAULT 1,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS services (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      slug        VARCHAR(100) NOT NULL UNIQUE,
      section     VARCHAR(50) NOT NULL,
      icon        VARCHAR(10),
      image_url   VARCHAR(500),
      name_fr     VARCHAR(200) NOT NULL,
      name_en     VARCHAR(200),
      name_rw     VARCHAR(200),
      desc_fr     TEXT,
      desc_en     TEXT,
      desc_rw     TEXT,
      sort_order  INT DEFAULT 0,
      is_active   TINYINT(1) DEFAULT 1,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS documents (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      type         ENUM('homelie','mwigisha','urumuri','nouvelles') NOT NULL,
      title_fr     VARCHAR(300) NOT NULL,
      title_en     VARCHAR(300),
      title_rw     VARCHAR(300),
      content_fr   LONGTEXT,
      content_en   LONGTEXT,
      content_rw   LONGTEXT,
      file_url     VARCHAR(500),
      image_url    VARCHAR(500),
      author_id    INT,
      is_published TINYINT(1) DEFAULT 1,
      published_at DATETIME,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS settings (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      value       TEXT,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS contact_messages (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(150) NOT NULL,
      email      VARCHAR(150) NOT NULL,
      subject    VARCHAR(300),
      message    TEXT NOT NULL,
      is_read    TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ];

  for (const sql of tables) {
    await conn.query(sql);
  }
  console.log("✅  All tables created");

  // ── Seed admin user ───────────────────────────────────────
  const adminEmail    = "admin@diocesedekabgayi.org";
  const adminPassword = "Admin@Kabgayi2024";
  const hash          = await bcrypt.hash(adminPassword, 10);

  // Delete existing admin to ensure fresh hash
  await conn.query("DELETE FROM admin_users WHERE email = ?", [adminEmail]);
  await conn.query(
    "INSERT INTO admin_users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Super Admin", adminEmail, hash, "superadmin"]
  );
  console.log("✅  Admin user created");
  console.log(`   Email    : ${adminEmail}`);
  console.log(`   Password : ${adminPassword}`);
  console.log(`   Role     : superadmin`);

  // ── Seed settings ─────────────────────────────────────────
  const settingsList = [
    ["site_name_fr",   "Diocèse de Kabgayi"],
    ["site_name_en",   "Diocese of Kabgayi"],
    ["site_name_rw",   "Diyosezi ya Kabgayi"],
    ["bishop_name",    "Mgr Balthazar NTIVUGURUZWA"],
    ["bishop_role_fr", "Évêque du Diocèse de Kabgayi"],
    ["phone",          "+250 788 315 609"],
    ["email",          "info@diocesedekabgayi.org"],
    ["address",        "B.P. 23 Kabgayi – Rwanda"],
    ["facebook",       "https://www.facebook.com/diocesedekabgayi"],
    ["youtube",        "https://www.youtube.com/diocesedekabgayi"],
    ["instagram",      "https://www.instagram.com/diocesedekabgayi"],
  ];
  for (const [k, v] of settingsList) {
    await conn.query(
      "INSERT INTO settings (setting_key,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)",
      [k, v]
    );
  }
  console.log("✅  Settings seeded");

  // ── Seed hero slides ──────────────────────────────────────
  const [existing] = await conn.query("SELECT COUNT(*) as c FROM hero_slides");
  if (existing[0].c === 0) {
    const heroSlides = [
      {
        badge: "DIOCÈSE DE KABGAYI",
        image_url: "https://images.unsplash.com/photo-1548625149-720754952028?w=900&q=85",
        title_fr: "Annoncer le Christ,\nConstruire la Paix.",
        title_en: "Proclaiming Christ,\nBuilding Peace.",
        title_rw: "Gutangaza Kristu,\nOkubaka Amahoro.",
        desc_fr: "Unis dans la foi, nous annonçons l'Évangile, servons nos frères et bâtissons un monde plus juste.",
        desc_en: "United in faith, we proclaim the Gospel, serve our brothers and sisters.",
        desc_rw: "Hamwe mu kwizera, turatangaza Ubutumwa Bwiza kandi tubaka isi.",
        points_fr: ["Fondé sur la foi catholique depuis 1912", "47 paroisses au service du peuple de Dieu", "Présence active dans l'éducation et la santé"],
        points_en: ["Founded on the Catholic faith since 1912", "47 parishes serving the people of God", "Active presence in education and health"],
        points_rw: ["Ishingiye ku kwizera gwa Gatolika kuva 1912", "Paruwasi 47 zisukura abantu b'Imana", "Irimo mu burezi n'ubuvuzi"],
        sort_order: 1,
      },
      {
        badge: "PASTORALE",
        image_url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&q=85",
        title_fr: "Une Église au Service\nde Tous.",
        title_en: "A Church at the Service\nof All.",
        title_rw: "Itorero Risukura\nBose.",
        desc_fr: "Le Diocèse de Kabgayi accompagne les fidèles dans leur vie spirituelle et sociale.",
        desc_en: "The Diocese of Kabgayi accompanies the faithful in their spiritual and social life.",
        desc_rw: "Diyosezi ya Kabgayi ifasha abakristu mu buzima bw'ubuzimu n'imibereho.",
        points_fr: ["Hôpital de Kabgayi au service des malades", "Centres de spiritualité et retraites", "Caritas pour les plus démunis"],
        points_en: ["Kabgayi Hospital serving the sick", "Spirituality centers and retreats", "Caritas for the most vulnerable"],
        points_rw: ["Ibitaro bya Kabgayi bisukura abarwayi", "Ibigo bya spiritualité n'amahugurwa", "Caritas ifasha abakene"],
        sort_order: 2,
      },
      {
        badge: "ÉDUCATION & CULTURE",
        image_url: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=900&q=85",
        title_fr: "Former les Hommes,\nÉclairer les Esprits.",
        title_en: "Educating People,\nEnlightening Minds.",
        title_rw: "Guhugura Abantu,\nGukangura Ibitekerezo.",
        desc_fr: "À travers l'Institut Catholique et l'Imprimerie de Kabgayi, nous investissons dans l'avenir du Rwanda.",
        desc_en: "Through the Catholic Institute and Kabgayi Print House, we invest in Rwanda's future.",
        desc_rw: "Binyuze mu Inshuri Gatolika n'inzego z'ibyapa, tushyira igihugu cy'Rwanda mu gihe kizaza.",
        points_fr: ["Institut Catholique de Kabgayi", "Réseau d'écoles catholiques", "Imprimerie et publication diocésaines"],
        points_en: ["Catholic Institute of Kabgayi", "Network of Catholic schools", "Diocesan printing and publishing"],
        points_rw: ["Inshuri Gatolika ya Kabgayi", "Amashuri menshi ya Gatolika", "Inzego z'ibyapa na gaseti ya diyosezi"],
        sort_order: 3,
      },
    ];

    for (const s of heroSlides) {
      await conn.query(
        `INSERT INTO hero_slides
         (badge,image_url,title_fr,title_en,title_rw,desc_fr,desc_en,desc_rw,
          points_fr,points_en,points_rw,sort_order,is_active)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)`,
        [
          s.badge, s.image_url,
          s.title_fr, s.title_en, s.title_rw,
          s.desc_fr,  s.desc_en,  s.desc_rw,
          JSON.stringify(s.points_fr),
          JSON.stringify(s.points_en),
          JSON.stringify(s.points_rw),
          s.sort_order,
        ]
      );
    }
    console.log("✅  Hero slides seeded (3 slides)");
  } else {
    console.log("⏭️   Hero slides already exist — skipped");
  }

  await conn.end();

  console.log("\n🎉  Setup complete!");
  console.log("===========================================");
  console.log("  Admin Portal : http://localhost:3001");
  console.log("  Email        : admin@diocesedekabgayi.org");
  console.log("  Password     : Admin@Kabgayi2024");
  console.log("===========================================\n");
}

setup().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
