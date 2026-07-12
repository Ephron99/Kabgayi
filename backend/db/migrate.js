/**
 * Migration: Add bishop_message and agenda_events tables
 * Run: node db/migrate.js
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
    CREATE TABLE IF NOT EXISTS bishop_message (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      message_fr LONGTEXT,
      message_en LONGTEXT,
      message_rw LONGTEXT,
      photo_url  VARCHAR(500),
      bishop_name    VARCHAR(200) DEFAULT 'Mgr Balthazar NTIVUGURUZWA',
      bishop_role_fr VARCHAR(200) DEFAULT 'Évêque du Diocèse de Kabgayi',
      bishop_role_en VARCHAR(200) DEFAULT 'Bishop of the Diocese of Kabgayi',
      bishop_role_rw VARCHAR(200) DEFAULT 'Umusenyeri wa Diyosezi ya Kabgayi',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  bishop_message table ready");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS agenda_events (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      day      VARCHAR(2)   NOT NULL,
      month_fr VARCHAR(20)  NOT NULL,
      month_en VARCHAR(20),
      month_rw VARCHAR(20),
      title_fr VARCHAR(300) NOT NULL,
      title_en VARCHAR(300),
      title_rw VARCHAR(300),
      place_fr VARCHAR(300),
      place_en VARCHAR(300),
      place_rw VARCHAR(300),
      event_date DATE,
      sort_order INT DEFAULT 0,
      is_active  TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  agenda_events table ready");

  // Seed default bishop message
  const [bm] = await conn.query("SELECT COUNT(*) as c FROM bishop_message");
  if (bm[0].c === 0) {
    await conn.query(`INSERT INTO bishop_message
      (message_fr, message_en, message_rw) VALUES (?,?,?)`,
      [
        "Soyons des témoins joyeux de l'Évangile, au service de l'amour et de la vérité.",
        "Let us be joyful witnesses of the Gospel, in the service of love and truth.",
        "Tube inzira z'inkuru nziza, mu gusukura urukundo n'ukuri.",
      ]
    );
    console.log("✅  Bishop message seeded");
  }

  // Seed default agenda events
  const [ae] = await conn.query("SELECT COUNT(*) as c FROM agenda_events");
  if (ae[0].c === 0) {
    const events = [
      ["25","MAI","MAY","GICURASI","Pèlerinage diocésain à Kibeho","Diocesan pilgrimage to Kibeho","Urugendo rwa diyosezi i Kibeho","Basilique de Kibeho","Kibeho Basilica","Katedrale ya Kibeho","2026-05-25",1],
      ["02","JUIN","JUNE","KAMENA","Ordination presbytérale","Priestly ordination","Ubupadiri bushya","Basilique de Kabgayi","Kabgayi Basilica","Katedrale ya Kabgayi","2026-06-02",2],
      ["15","JUIN","JUNE","KAMENA","Retraite des jeunes","Youth retreat","Amahoro y'urubyiruko","Centre pastoral de Kabgayi","Kabgayi Pastoral Centre","Ikigo cya pastoral","2026-06-15",3],
      ["29","JUIN","JUNE","KAMENA","Assemblée diocésaine","Diocesan assembly","Inteko ya diyosezi","Centre pastoral de Kabgayi","Kabgayi Pastoral Centre","Ikigo cya pastoral","2026-06-29",4],
    ];
    for (const e of events) {
      await conn.query(`INSERT INTO agenda_events
        (day,month_fr,month_en,month_rw,title_fr,title_en,title_rw,place_fr,place_en,place_rw,event_date,sort_order)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, e);
    }
    console.log("✅  Agenda events seeded (4 events)");
  }

  await conn.end();
  console.log("\n🎉  Migration complete!");
}
migrate().catch((e) => { console.error("❌", e.message); process.exit(1); });
