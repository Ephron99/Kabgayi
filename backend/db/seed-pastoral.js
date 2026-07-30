require("dotenv").config();
const mysql = require("mysql2/promise");

async function seed() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await conn.query("DELETE FROM pastoral_items");

  const items = [
    // Top-level parents with children
    { parent_id: null, slug: "catechese", name_fr: "CATÉCHÈSE", name_en: "CATECHESIS", name_rw: "ITEGEKO", sort_order: 1 },
    { parent_id: 1,    slug: "1ere-communion", name_fr: "Première Communion", name_en: "First Communion", name_rw: "Communion y'Umwaka wa 1", sort_order: 1 },
    { parent_id: 1,    slug: "confirmation", name_fr: "Confirmation", name_en: "Confirmation", name_rw: "Ibishimika", sort_order: 2 },
    { parent_id: 1,    slug: "catechumenat", name_fr: "Catéchuménat", name_en: "Catechumenate", name_rw: "Gusoma Itegeko", sort_order: 3 },
    { parent_id: 1,    slug: "bapteme", name_fr: "Baptême", name_en: "Baptism", name_rw: "Ubaptizumo", sort_order: 4 },

    { parent_id: null, slug: "liturgie", name_fr: "LITURGIE", name_en: "LITURGY", name_rw: "ITERITARO", sort_order: 2 },
    { parent_id: 6,    slug: "messe-dominicale", name_fr: "Messe dominicale", name_en: "Sunday Mass", name_rw: "Umwabura wa Cyumweru", sort_order: 1 },
    { parent_id: 6,    slug: "adoration", name_fr: "Adoration eucharistique", name_en: "Eucharistic Adoration", name_rw: "Gusenga Ibirayi bya Kristu", sort_order: 2 },
    { parent_id: 6,    slug: "choeur", name_fr: "Chœur paroissial", name_en: "Parish Choir", name_rw: "Inyigisho z'Indirimbo", sort_order: 3 },

    { parent_id: null, slug: "sacrements", name_fr: "SACREMENTS", name_en: "SACRAMENTS", name_rw: "AMAGAMBO MEZA Y'UMWAMI", sort_order: 3 },
    { parent_id: 10,   slug: "mariage", name_fr: "Mariage", name_en: "Marriage", name_rw: "Ubukwe", sort_order: 1 },
    { parent_id: 10,   slug: "penitence", name_fr: "Pénitence", name_en: "Penance", name_rw: "Ishirahamwe", sort_order: 2 },
    { parent_id: 10,   slug: "onction-malades", name_fr: "Onction des malades", name_en: "Anointing of the Sick", name_rw: "Gusukura abarwayi n'amakuru", sort_order: 3 },

    // Standalone (no children)
    { parent_id: null, slug: "caritas", name_fr: "CARITAS DIOCÉSAINE", name_en: "DIOCESAN CARITAS", name_rw: "CARITAS YA DIYOSEZI", sort_order: 4 },
    { parent_id: null, slug: "aumonerie", name_fr: "AUMÔNERIE", name_en: "CHAPLAINCY", name_rw: "UMUHAMAGARO WA DIYOSEZI", sort_order: 5 },
    { parent_id: null, slug: "spirituality-centers", name_fr: "CENTRES DE SPIRITUALITÉ", name_en: "SPIRITUALITY CENTERS", name_rw: "AMABUGA Y'UBUZIMA BWEJEWE", sort_order: 6 },
  ];

  const sql = `INSERT INTO pastoral_items
    (parent_id, slug, name_fr, name_en, name_rw, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)`;

  for (const it of items) {
    await conn.query(sql, [
      it.parent_id,
      it.slug,
      it.name_fr,
      it.name_en || null,
      it.name_rw || null,
      it.sort_order || 0,
    ]);
  }

  const [rows] = await conn.query(
    "SELECT id, name_fr, parent_id, is_active FROM pastoral_items ORDER BY sort_order, id"
  );

  console.log("Seeded", rows.length, "pastoral_items:");
  console.table(rows);

  await conn.end();
  console.log("\nDone.");
}

seed().catch((e) => { console.error("Seed failed:", e.message); process.exit(1); });
