/**
 * CONTENT SEED SCRIPT
 * Run: node db/seed.js   (or: npm run seed)
 *
 * Populates the main content tables with sample data:
 *   parishes, services, news, documents, pastoral_items.
 *
 * Prerequisites:
 *   - Core tables must already exist → run `npm run setup` first.
 *     (pastoral_items is created here automatically if missing.)
 *   - DB_* values in backend/.env must point at a reachable MySQL server.
 *
 * Re-running is safe: existing rows in these tables are cleared first.
 * The first admin user found becomes the default author for news/documents.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "kabgayi";

// ── Sample data ──────────────────────────────────────────────
// Services (sections match the public routes: "services" and "education")
const services = [
  {
    slug: "economat", section: "services", icon: "🏛️",
    name_fr: "Économat Général", name_en: "General Economat", name_rw: "Ubutunzi Rusange",
    desc_fr: "Gestion des biens et des finances du diocèse.",
    desc_en: "Management of the diocese's assets and finances.",
    desc_rw: "Gucunga umutungo n'imari bya diyosezi.",
  },
  {
    slug: "caritas", section: "services", icon: "❤️",
    name_fr: "Caritas Diocésaine", name_en: "Diocesan Caritas", name_rw: "Caritas ya Diyosezi",
    desc_fr: "Action caritative et aide aux plus vulnérables.",
    desc_en: "Charitable work and support for the most vulnerable.",
    desc_rw: "Gufasha abababaye n'abakennye.",
  },
  {
    slug: "hopital", section: "services", icon: "🏥",
    name_fr: "Hôpital de Kabgayi", name_en: "Kabgayi Hospital", name_rw: "Ibitaro bya Kabgayi",
    desc_fr: "Soins de santé au service de la population.",
    desc_en: "Healthcare services for the local population.",
    desc_rw: "Serivisi z'ubuvuzi ku baturage.",
  },
  {
    slug: "hotel-saint-andre", section: "services", icon: "🏨",
    name_fr: "Hôtel Saint-André", name_en: "Saint-André Hotel", name_rw: "Hoteli Saint-André",
    desc_fr: "Hébergement et accueil des visiteurs du diocèse.",
    desc_en: "Accommodation and hospitality for diocese visitors.",
    desc_rw: "Kwakira no gucumbikira abashyitsi ba diyosezi.",
  },
  {
    slug: "imprimerie", section: "services", icon: "🖨️",
    name_fr: "Imprimerie de Kabgayi", name_en: "Kabgayi Printing House", name_rw: "Icapiro rya Kabgayi",
    desc_fr: "Impression et publication des documents diocésains.",
    desc_en: "Printing and publishing of diocesan documents.",
    desc_rw: "Gucapa no gusohora inyandiko za diyosezi.",
  },
  {
    slug: "centres-spiritualite", section: "services", icon: "🕊️",
    name_fr: "Centres de Spiritualité", name_en: "Spirituality Centers", name_rw: "Ibigo by'Umwuka",
    desc_fr: "Lieux de retraite et d'accompagnement spirituel.",
    desc_en: "Places for retreats and spiritual accompaniment.",
    desc_rw: "Ahantu ho gusenga no kwiyunga n'Imana.",
  },
  {
    slug: "education-catholique", section: "education", icon: "📚",
    name_fr: "Éducation Catholique et Catéchèse", name_en: "Catholic Education & Catechesis", name_rw: "Uburezi Gatolika n'Iyigishamategeko",
    desc_fr: "Coordination des écoles catholiques et de la catéchèse.",
    desc_en: "Coordination of Catholic schools and catechesis.",
    desc_rw: "Guhuza amashuri gatolika n'iyigishamategeko.",
  },
  {
    slug: "institut-catholique", section: "education", icon: "🎓",
    name_fr: "Institut Catholique de Kabgayi (ICK)", name_en: "Catholic Institute of Kabgayi (ICK)", name_rw: "Ikigo Gatolika cya Kabgayi (ICK)",
    desc_fr: "Enseignement supérieur et formation intellectuelle.",
    desc_en: "Higher education and intellectual formation.",
    desc_rw: "Amashuri makuru n'ubumenyi.",
  },
];

// Sample parishes — replace with the official list from docs/PAROISSES
const parishes = [
  {
    name: "Cathédrale Notre-Dame de Kabgayi", location: "Kabgayi, Muhanga",
    vicar: "Abbé Jean Bosco Uwimana", phone: "+250 788 315 609",
    email: "cathedrale@diocesekabgayi.rw",
    description: "Église mère du diocèse, siège de la cathèdre de l'évêque.",
  },
  {
    name: "Paroisse Muhanga", location: "Muhanga",
    vicar: "Abbé Emmanuel Nsengiyumva", phone: "+250 788 000 001",
    email: "muhanga@diocesekabgayi.rw",
    description: "Paroisse du centre-ville de Muhanga.",
  },
  {
    name: "Paroisse Kibangu", location: "Kibangu",
    vicar: "Abbé Pierre Claver Habimana", phone: "+250 788 000 002",
    email: "kibangu@diocesekabgayi.rw",
    description: "Communauté paroissiale de Kibangu.",
  },
  {
    name: "Paroisse Gitarama", location: "Gitarama",
    vicar: "Abbé Théoneste Rukundo", phone: "+250 788 000 003",
    email: "gitarama@diocesekabgayi.rw",
    description: "Paroisse historique de la région de Gitarama.",
  },
  {
    name: "Paroisse Nyarusange", location: "Nyarusange",
    vicar: "Abbé Samuel Ndayisaba", phone: "+250 788 000 004",
    email: "nyarusange@diocesekabgayi.rw",
    description: "Paroisse rurale de Nyarusange.",
  },
  {
    name: "Paroisse Kagoma", location: "Kagoma",
    vicar: "Abbé Fidèle Munyaneza", phone: "+250 788 000 005",
    email: "kagoma@diocesekabgayi.rw",
    description: "Communauté paroissiale de Kagoma.",
  },
];

const news = [
  {
    category_fr: "Vie du Diocèse", category_en: "Diocesan Life", category_rw: "Ubuzima bwa Diyosezi",
    title_fr: "Ouverture de l'année pastorale 2026",
    title_en: "Opening of the 2026 pastoral year",
    title_rw: "Itangizwa ry'umwaka w'ubutumwa 2026",
    excerpt_fr: "L'évêque a ouvert la nouvelle année pastorale entouré des fidèles et des prêtres du diocèse.",
    excerpt_en: "The bishop opened the new pastoral year surrounded by the faithful and priests of the diocese.",
    excerpt_rw: "Umwepiskopi yafunguye umwaka mushya w'ubutumwa ari kumwe n'abakristu n'abapadiri.",
    content_fr: "<p>C'est dans la joie et le recueillement que le Diocèse de Kabgayi a ouvert son année pastorale 2026, en présence de l'évêque, des prêtres et de nombreux fidèles.</p>",
    content_en: "<p>With joy and recollection, the Diocese of Kabgayi opened its 2026 pastoral year, in the presence of the bishop, priests and many faithful.</p>",
    content_rw: "<p>Mu byishimo no mu bwitonzi, Diyosezi ya Kabgayi yafunguye umwaka wayo w'ubutumwa 2026, imbere y'umwepiskopi, abapadiri n'abakristu benshi.</p>",
    image_url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&q=85",
    is_published: 1, published_at: "2026-01-12 09:00:00",
  },
  {
    category_fr: "Éducation", category_en: "Education", category_rw: "Uburezi",
    title_fr: "Remise des diplômes à l'Institut Catholique de Kabgayi",
    title_en: "Graduation ceremony at the Catholic Institute of Kabgayi",
    title_rw: "Itangwa ry'impamyabushobozi ku Kigo Gatolika cya Kabgayi",
    excerpt_fr: "Les nouveaux diplômés de l'ICK ont été célébrés lors d'une cérémonie solennelle.",
    excerpt_en: "The new ICK graduates were celebrated during a solemn ceremony.",
    excerpt_rw: "Abize barangije muri ICK bashimiwe mu muhango ukomeye.",
    content_fr: "<p>L'Institut Catholique de Kabgayi a célébré ses nouveaux diplômés, saluant leur engagement et leur réussite académique.</p>",
    content_en: "<p>The Catholic Institute of Kabgayi celebrated its new graduates, honouring their commitment and academic success.</p>",
    content_rw: "<p>Ikigo Gatolika cya Kabgayi cyashimiye abize barangije, kibashimira ubwitange n'intsinzi yabo.</p>",
    image_url: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=900&q=85",
    is_published: 1, published_at: "2026-02-20 10:30:00",
  },
  {
    category_fr: "Caritas", category_en: "Caritas", category_rw: "Caritas",
    title_fr: "Distribution d'aide aux familles vulnérables",
    title_en: "Aid distribution to vulnerable families",
    title_rw: "Ikwirakwizwa ry'inkunga ku miryango ikennye",
    excerpt_fr: "Caritas diocésaine a distribué des vivres et des fournitures aux familles dans le besoin.",
    excerpt_en: "Diocesan Caritas distributed food and supplies to families in need.",
    excerpt_rw: "Caritas ya diyosezi yagabije ibiribwa n'ibikoresho ku miryango ibikeneye.",
    content_fr: "<p>Dans le cadre de sa mission caritative, Caritas diocésaine a apporté un soutien concret aux familles les plus vulnérables du diocèse.</p>",
    content_en: "<p>As part of its charitable mission, diocesan Caritas brought concrete support to the most vulnerable families of the diocese.</p>",
    content_rw: "<p>Mu rwego rw'ubutumwa bwayo bwo gufasha, Caritas ya diyosezi yafashije mu buryo bufatika imiryango ikennye cyane.</p>",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=85",
    is_published: 1, published_at: "2026-03-15 14:00:00",
  },
  {
    category_fr: "Santé", category_en: "Health", category_rw: "Ubuzima",
    title_fr: "Nouveau service de pédiatrie à l'Hôpital de Kabgayi",
    title_en: "New paediatrics ward at Kabgayi Hospital",
    title_rw: "Ishami rishya ry'ubuvuzi bw'abana ku Bitaro bya Kabgayi",
    excerpt_fr: "L'Hôpital de Kabgayi ouvre un service dédié à la santé des enfants.",
    excerpt_en: "Kabgayi Hospital opens a ward dedicated to children's health.",
    excerpt_rw: "Ibitaro bya Kabgayi bifunguye ishami ryita ku buzima bw'abana.",
    content_fr: "<p>L'Hôpital de Kabgayi renforce son offre de soins avec l'ouverture d'un nouveau service de pédiatrie au service des familles.</p>",
    content_en: "<p>Kabgayi Hospital strengthens its care offer with the opening of a new paediatrics ward serving families.</p>",
    content_rw: "<p>Ibitaro bya Kabgayi byongereye serivisi zabyo hifungurwa ishami rishya ry'ubuvuzi bw'abana.</p>",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=85",
    is_published: 1, published_at: "2026-04-05 08:45:00",
  },
];

const documents = [
  {
    type: "homelie",
    title_fr: "Homélie — 3ème dimanche du Temps Ordinaire",
    title_en: "Homily — 3rd Sunday of Ordinary Time",
    title_rw: "Nyigisho — Icyumweru cya 3 gisanzwe",
    content_fr: "<p>Texte de l'homélie prononcée à la cathédrale Notre-Dame de Kabgayi.</p>",
    content_en: "<p>Text of the homily delivered at Notre-Dame de Kabgayi cathedral.</p>",
    content_rw: "<p>Inyandiko y'inyigisho yatangiwe muri katedarali Notre-Dame ya Kabgayi.</p>",
    is_published: 1, published_at: "2026-01-25 08:00:00",
  },
  {
    type: "urumuri",
    title_fr: "Urumuri — Bulletin diocésain",
    title_en: "Urumuri — Diocesan bulletin",
    title_rw: "Urumuri — Ikinyamakuru cya diyosezi",
    content_fr: "<p>Bulletin d'information et de réflexion du diocèse.</p>",
    content_en: "<p>Information and reflection bulletin of the diocese.</p>",
    content_rw: "<p>Ikinyamakuru cy'amakuru n'ibitekerezo bya diyosezi.</p>",
    is_published: 1, published_at: "2026-02-01 08:00:00",
  },
  {
    type: "mwigisha",
    title_fr: "Mwigisha — Guide catéchétique",
    title_en: "Mwigisha — Catechetical guide",
    title_rw: "Mwigisha — Igitabo cy'iyigishamategeko",
    content_fr: "<p>Support de catéchèse pour les paroisses du diocèse.</p>",
    content_en: "<p>Catechetical material for the parishes of the diocese.</p>",
    content_rw: "<p>Ibikoresho by'iyigishamategeko ku maparuwasi ya diyosezi.</p>",
    is_published: 1, published_at: "2026-02-10 08:00:00",
  },
];

// Pastoral items — `parent` references another item's slug (null = top-level).
// Mirrors db/seed-pastoral.js but resolves parents by slug instead of hardcoded ids.
const pastoral = [
  // CATÉCHÈSE
  { parent: null, slug: "catechese", name_fr: "CATÉCHÈSE", name_en: "CATECHESIS", name_rw: "ITEGEKO", sort_order: 1 },
  { parent: "catechese", slug: "1ere-communion", name_fr: "Première Communion", name_en: "First Communion", name_rw: "Communion y'Umwaka wa 1", sort_order: 1 },
  { parent: "catechese", slug: "confirmation", name_fr: "Confirmation", name_en: "Confirmation", name_rw: "Ibishimika", sort_order: 2 },
  { parent: "catechese", slug: "catechumenat", name_fr: "Catéchuménat", name_en: "Catechumenate", name_rw: "Gusoma Itegeko", sort_order: 3 },
  { parent: "catechese", slug: "bapteme", name_fr: "Baptême", name_en: "Baptism", name_rw: "Ubaptizumo", sort_order: 4 },

  // LITURGIE
  { parent: null, slug: "liturgie", name_fr: "LITURGIE", name_en: "LITURGY", name_rw: "ITERITARO", sort_order: 2 },
  { parent: "liturgie", slug: "messe-dominicale", name_fr: "Messe dominicale", name_en: "Sunday Mass", name_rw: "Umwabura wa Cyumweru", sort_order: 1 },
  { parent: "liturgie", slug: "adoration", name_fr: "Adoration eucharistique", name_en: "Eucharistic Adoration", name_rw: "Gusenga Ibirayi bya Kristu", sort_order: 2 },
  { parent: "liturgie", slug: "choeur", name_fr: "Chœur paroissial", name_en: "Parish Choir", name_rw: "Inyigisho z'Indirimbo", sort_order: 3 },

  // SACREMENTS
  { parent: null, slug: "sacrements", name_fr: "SACREMENTS", name_en: "SACRAMENTS", name_rw: "AMAGAMBO MEZA Y'UMWAMI", sort_order: 3 },
  { parent: "sacrements", slug: "mariage", name_fr: "Mariage", name_en: "Marriage", name_rw: "Ubukwe", sort_order: 1 },
  { parent: "sacrements", slug: "penitence", name_fr: "Pénitence", name_en: "Penance", name_rw: "Ishirahamwe", sort_order: 2 },
  { parent: "sacrements", slug: "onction-malades", name_fr: "Onction des malades", name_en: "Anointing of the Sick", name_rw: "Gusukura abarwayi n'amakuru", sort_order: 3 },

  // Standalone (no children)
  { parent: null, slug: "caritas", name_fr: "CARITAS DIOCÉSAINE", name_en: "DIOCESAN CARITAS", name_rw: "CARITAS YA DIYOSEZI", sort_order: 4 },
  { parent: null, slug: "aumonerie", name_fr: "AUMÔNERIE", name_en: "CHAPLAINCY", name_rw: "UMUHAMAGARO WA DIYOSEZI", sort_order: 5 },
  { parent: null, slug: "spirituality-centers", name_fr: "CENTRES DE SPIRITUALITÉ", name_en: "SPIRITUALITY CENTERS", name_rw: "AMABUGA Y'UBUZIMA BWEJEWE", sort_order: 6 },
];

// ── Seed runner ──────────────────────────────────────────────
async function seed() {
  console.log("🌱  Kabgayi Diocese — Content Seed");
  console.log("===================================\n");

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: DB_NAME,
    charset:  "utf8mb4",
  });
  console.log("✅  Connected to MySQL —", DB_NAME);

  // Default author for news/documents (first admin user found)
  const [admins] = await conn.query("SELECT id FROM admin_users ORDER BY id LIMIT 1");
  const authorId = admins.length ? admins[0].id : null;

  // ── Services ──────────────────────────────────────────────
  await conn.query("DELETE FROM services");
  const svcSql = `INSERT INTO services
    (slug, section, icon, image_url, name_fr, name_en, name_rw,
     desc_fr, desc_en, desc_rw, sort_order, is_active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,1)`;
  for (const [i, s] of services.entries()) {
    await conn.query(svcSql, [
      s.slug, s.section, s.icon || null, s.image_url || null,
      s.name_fr, s.name_en || null, s.name_rw || null,
      s.desc_fr || null, s.desc_en || null, s.desc_rw || null,
      i + 1,
    ]);
  }
  console.log(`✅  services    : ${services.length}`);

  // ── Parishes ──────────────────────────────────────────────
  await conn.query("DELETE FROM parishes");
  const parSql = `INSERT INTO parishes
    (name, location, vicar, phone, email, image_url, description, sort_order, is_active)
    VALUES (?,?,?,?,?,?,?,?,1)`;
  for (const [i, p] of parishes.entries()) {
    await conn.query(parSql, [
      p.name, p.location || null, p.vicar || null, p.phone || null,
      p.email || null, p.image_url || null, p.description || null, i + 1,
    ]);
  }
  console.log(`✅  parishes    : ${parishes.length}`);

  // ── News ──────────────────────────────────────────────────
  await conn.query("DELETE FROM news");
  const newsSql = `INSERT INTO news
    (category_fr, category_en, category_rw, title_fr, title_en, title_rw,
     excerpt_fr, excerpt_en, excerpt_rw, content_fr, content_en, content_rw,
     image_url, author_id, is_published, published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  for (const n of news) {
    await conn.query(newsSql, [
      n.category_fr || null, n.category_en || null, n.category_rw || null,
      n.title_fr, n.title_en || null, n.title_rw || null,
      n.excerpt_fr || null, n.excerpt_en || null, n.excerpt_rw || null,
      n.content_fr || null, n.content_en || null, n.content_rw || null,
      n.image_url || null, authorId, n.is_published ? 1 : 0,
      n.published_at || new Date(),
    ]);
  }
  console.log(`✅  news        : ${news.length}`);

  // ── Documents ─────────────────────────────────────────────
  await conn.query("DELETE FROM documents");
  const docSql = `INSERT INTO documents
    (type, title_fr, title_en, title_rw, content_fr, content_en, content_rw,
     file_url, image_url, author_id, is_published, published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
  for (const d of documents) {
    await conn.query(docSql, [
      d.type, d.title_fr, d.title_en || null, d.title_rw || null,
      d.content_fr || null, d.content_en || null, d.content_rw || null,
      d.file_url || null, d.image_url || null, authorId,
      d.is_published ? 1 : 0, d.published_at || new Date(),
    ]);
  }
  console.log(`✅  documents   : ${documents.length}`);

  // ── Pastoral items ────────────────────────────────────────
  // setup.js does not create pastoral_items (migrate-pastoral.js does),
  // so ensure it exists here to keep this seeder self-contained.
  await conn.query(`CREATE TABLE IF NOT EXISTS pastoral_items (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await conn.query("DELETE FROM pastoral_items");
  const pasSql = `INSERT INTO pastoral_items
    (parent_id, slug, name_fr, name_en, name_rw, sort_order, is_active)
    VALUES (?,?,?,?,?,?,1)`;

  // Insert parents first (capture generated ids by slug), then children.
  const idBySlug = {};
  for (const it of pastoral.filter((x) => !x.parent)) {
    const [res] = await conn.query(pasSql, [
      null, it.slug, it.name_fr, it.name_en || null, it.name_rw || null, it.sort_order || 0,
    ]);
    idBySlug[it.slug] = res.insertId;
  }
  for (const it of pastoral.filter((x) => x.parent)) {
    await conn.query(pasSql, [
      idBySlug[it.parent] || null, it.slug, it.name_fr,
      it.name_en || null, it.name_rw || null, it.sort_order || 0,
    ]);
  }
  console.log(`✅  pastoral    : ${pastoral.length}`);

  const [rows] = await conn.query(
    "SELECT slug, name_fr, section FROM services ORDER BY sort_order, id"
  );
  console.log("\nSeeded services:");
  console.table(rows);

  await conn.end();
  console.log("🎉  Content seed complete!");
}

seed().catch((err) => {
  if (err && err.code === "ER_NO_SUCH_TABLE") {
    console.error("\n❌  A required table is missing.");
    console.error("👉  Run `npm run setup` (and any migrations) first.");
  } else {
    console.error("\n❌  Seed failed:", err.message);
  }
  process.exit(1);
});
