/**
 * Migration + seed: "À Propos" (About) page content
 * Creates about_content, about_stats and about_collaborators tables
 * and seeds them with the current static page content.
 *
 * Run: node db/migrate-about.js   (from the backend folder)
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");

// ── Default content (mirrors the former static AboutPage) ──────────────
const CONTENT = {
  hero_title_fr: "À Propos du Diocèse de Kabgayi",
  hero_title_en: "About the Diocese of Kabgayi",
  hero_title_rw: "Ibyerekeye Diyosezi ya Kabgayi",
  hero_subtitle_fr: "Une Église particulière au cœur du Rwanda",
  hero_subtitle_en: "A particular Church at the heart of Rwanda",
  hero_subtitle_rw: "Itorero ryihariye mu Rwanda",
  diocese_tab_fr: "Le Diocèse",
  diocese_tab_en: "The Diocese",
  diocese_tab_rw: "Diyosezi",
  bishop_tab_fr: "Notre Évêque",
  bishop_tab_en: "Our Bishop",
  bishop_tab_rw: "Umusenyeri Wacu",
  diocese_title_fr: "Le Diocèse de Kabgayi",
  diocese_title_en: "The Diocese of Kabgayi",
  diocese_title_rw: "Diyosezi ya Kabgayi",
  diocese_text_fr: `Le diocèse de Kabgayi est une circonscription de l'Église catholique au Rwanda, dont le siège est situé à Gitarama, dans la Province du Sud. Il s'étend sur 2 187 km² à travers les districts de Muhanga, Kamonyi, Ruhango et Nyanza. Son évêque actuel, Mgr Balthazar Ntivuguruzwa, a été ordonné en juin 2023.

Le territoire du Diocèse de Kabgayi se situe en province Sud du Rwanda, et couvre l’étendue de trois districts à savoir Kamonyi, Muhanga et Ruhango ainsi qu’une petite portion du district de Nyanza sur une superficie de 2.187 km2. D’après les statistiques de l’année 2023, le diocèse de Kabgayi compte 695.920 catholiques sur une population approximative de 1.203.959 habitants, ce qui fait une portion de 57,8% de toute la population avec une diminution de 4% par rapport à l’année 2022.

Le Diocèse de Kabgayi est composé aujourd’hui de 31 paroisses. Les deux nouvelles paroisses sont celles de Kabugondo et Gasovu fondées en 2024.

Au niveau du Personnel apostolique, le nombre des prêtres diocésains résidents dans le Diocèse et dans les services interdiocésains au Rwanda s’élève à 101. Le diocèse compte 10 prêtres religieux qui font leur apostolat sous convention. Le total général de tous les prêtres diocésains, y compris ceux qui sont aux études et d’autres qui vivent à l’étranger, s’élève au nombre de 154 prêtres incardinés.

BREVE CHRONOLOGIE HIERARCHIQUE DU DIOCESE DE KABGAYI

L’histoire du Diocèse de Kabgayi se confond jusqu’en 1952 avec l’histoire religieuse du Christianisme au Rwanda.`,
  diocese_text_en: `The Diocese of Kabgayi is a circumscription of the Catholic Church in Rwanda, with its seat in Gitarama, in the Southern Province. It covers an area of 2,187 km² across the districts of Muhanga, Kamonyi, Ruhango and Nyanza. Its current bishop, Mgr Balthazar Ntivuguruzwa, was ordained in June 2023.

The Diocese of Kabgayi is located in the Southern Province of Rwanda and covers three districts: Kamonyi, Muhanga, and Ruhango, as well as a small portion of the Nyanza district, encompassing an area of 2,187 km². According to 2023 statistics, the Diocese of Kabgayi has 695,920 Catholics out of an approximate population of 1,203,959, representing 57.8% of the total population, a decrease of 4% compared to 2022.

The Diocese of Kabgayi currently comprises 31 parishes. The two new parishes are Kabugondo and Gasovu, founded in 2024.

Regarding the apostolic personnel, the number of diocesan priests residing in the Diocese and serving in interdiocesan offices in Rwanda is 101. The diocese has 10 religious priests who carry out their ministry under contract. The total number of all diocesan priests, including those studying and others living abroad, is 154 incardinated priests.

BRIEF HIERARCHICAL CHRONOLOGY OF THE DIOCESE OF KABGAYI

The history of the Diocese of Kabgayi is intertwined with the religious history of Christianity in Rwanda until 1952.`,
  diocese_text_rw: `Diyosezi ya Kabgayi ni ingengabitekerezo y'Itorero Gatolika mu Rwanda, aho icyicaro cya Gitarama, mu Ntara y'Epfo. Igizwe ku 2,187 km² kuzuye imirenge ya Muhanga, Kamonyi, Ruhango na Nyanza. Umusenyeri wayo ubu, Mgr Balthazar Ntivuguruzwa, yashinzwe mu kwezi wa Nyakanga 2023.

Diyosezi ya Kabgayi ni imwe mu Diyosezi za kera za Gatolika mu Rwanda. Yashinzwe mu ntangiriro z'ikinyejana cya 20 n'Ubutumwa bw'Abapadiri b'i Afrika (Pères Blancs), kandi yakoreye mu gukurura abantu kuri Yesu Kristu no guteza imbere abantu mu Rwanda.

Kabgayi, iherereye mu Ntara y'Epfo ya Rwanda, ni icyicaro cy'Umusenyeri kandi ikigarama nka Katedrale ya Notre-Dame ya Kabgayi, imwe mu nziza kandi za kera mu gihugu.`,
  diocese_image: "",
  stats_title_fr: "Statistiques du Diocèse 2026",
  stats_title_en: "Diocese Statistics 2026",
  stats_title_rw: "Imibare y'Ingenzi ya Diyosezi 2026",
  stats_designation_fr: "Désignation",
  stats_designation_en: "Designation",
  stats_designation_rw: "Icyo Bigaragaza",
  stats_figure_fr: "Chiffre",
  stats_figure_en: "Figure",
  stats_figure_rw: "Umubare",
  bishop_title_fr: "Mgr Balthazar Ntivuguruzwa",
  bishop_title_en: "Mgr Balthazar Ntivuguruzwa",
  bishop_title_rw: "Mgr Balthazar Ntivuguruzwa",
  bishop_role_fr: "Évêque du Diocèse de Kabgayi",
  bishop_role_en: "Bishop of the Diocese of Kabgayi",
  bishop_role_rw: "Umusenyeri wa Diyosezi ya Kabgayi",
  bishop_text_fr: "Mgr Balthazar Ntivuguruzwa est l'évêque actuel du Diocèse de Kabgayi, ordonné en juin 2023.",
  bishop_text_en: "Mgr Balthazar Ntivuguruzwa is the current bishop of the Diocese of Kabgayi, ordained in June 2023.",
  bishop_text_rw: "Mgr Balthazar Ntivuguruzwa ni umusenyeri w'ubu wa Diyosezi ya Kabgayi, yashinzwe mu kwezi wa Nyakanga 2023.",
  bishop_image: "",
  collab_title_fr: "Ses Collaborateurs",
  collab_title_en: "His Collaborators",
  collab_title_rw: "Abafasha be",
};

// Statistics rows — is_section=1 renders a full-width section header.
const STATS = [
  { label_fr: "Population", label_en: "Population", label_rw: "Abaturage", value: "1 120 821", is_section: 0 },
  { label_fr: "Baptisés Catholiques", label_en: "Baptized Catholics", label_rw: "Ababatijwe Abagatolika", value: "666 097", is_section: 0 },
  { label_fr: "Catéchumènes", label_en: "Catechumens", label_rw: "Abatoza", value: "5 668", is_section: 0 },
  { label_fr: "Total Catholiques", label_en: "Total Catholics", label_rw: "Abagatolika Bose", value: "638 368", is_section: 0 },
  { label_fr: "% des Cath. / Pop. Totale", label_en: "% Catholics / Total Pop.", label_rw: "% y'Abagatolika ku Baturage Bose", value: "59.20%", is_section: 0 },
  { label_fr: "Paroisses", label_en: "Parishes", label_rw: "Amaparuwasi", value: "31", is_section: 0 },
  { label_fr: "Centrales", label_en: "Central Stations", label_rw: "Ibigo Nkuru", value: "507", is_section: 0 },
  { label_fr: "Comités Ecclésiales de Base", label_en: "Basic Ecclesial Communities", label_rw: "Amatorero Mato", value: "5 927", is_section: 0 },
  { label_fr: "Prêtres", label_en: "Priests", label_rw: "Abapadiri", value: "", is_section: 1 },
  { label_fr: "Prêtres Diocésains", label_en: "Diocesan Priests", label_rw: "Abapadiri ba Diyosezi", value: "80", is_section: 0 },
  { label_fr: "Prêtres Religieux", label_en: "Religious Priests", label_rw: "Abapadiri b'Amashyirahamwe", value: "20", is_section: 0 },
  { label_fr: "Religieux", label_en: "Religious Brothers", label_rw: "Abarumuna", value: "77", is_section: 0 },
  { label_fr: "Religieuses", label_en: "Religious Sisters", label_rw: "Abaseturi", value: "430", is_section: 0 },
  { label_fr: "Communautés Masculines", label_en: "Male Communities", label_rw: "Amashyirahamwe y'Abagabo", value: "15", is_section: 0 },
  { label_fr: "Communautés Féminines", label_en: "Female Communities", label_rw: "Amashyirahamwe y'Abagore", value: "36", is_section: 0 },
  { label_fr: "Catéchistes", label_en: "Catechists", label_rw: "Abatekiseri", value: "740", is_section: 0 },
  { label_fr: "Grands Séminaristes", label_en: "Major Seminarians", label_rw: "Abasemenari Bakuru", value: "65", is_section: 0 },
  { label_fr: "Petits Séminaristes", label_en: "Minor Seminarians", label_rw: "Abasemenari Bato", value: "306", is_section: 0 },
  { label_fr: "Écoles", label_en: "Schools", label_rw: "Amashuri", value: "", is_section: 1 },
  { label_fr: "Écoles Primaires", label_en: "Primary Schools", label_rw: "Amashuri Abanza", value: "127", is_section: 0 },
  { label_fr: "Écoles Secondaires", label_en: "Secondary Schools", label_rw: "Amashuri Yisumbuye", value: "105", is_section: 0 },
  { label_fr: "Écoles Supérieures Laïques", label_en: "Lay Higher Education Schools", label_rw: "Amashuri Makuru y'Abasivili", value: "1", is_section: 0 },
  { label_fr: "Formations Sanitaires de l'Église", label_en: "Church Health Facilities", label_rw: "Ivuriro ry'Itorero", value: "", is_section: 1 },
  { label_fr: "Centres de Santé", label_en: "Health Centers", label_rw: "Ibigo Nderabuzima", value: "10", is_section: 0 },
  { label_fr: "Hôpitaux", label_en: "Hospitals", label_rw: "Ibitaro", value: "2", is_section: 0 },
];

const COLLABORATORS = [
  { name: "Mgr Hodari Jean de Dieu", role_fr: "Vicaire Général", role_en: "Vicar General", role_rw: "Visi Jenerali" },
  { name: "Abbé Joseph Emmanuel Kageruka", role_fr: "Chancelier", role_en: "Chancellor", role_rw: "Shanseliye" },
  { name: "Abbé Alype Hategekimana", role_fr: "Secrétaire de l'Évêché", role_en: "Secretary of the Bishopric", role_rw: "Umunyamabanga w'Ubwepiskopi" },
  { name: "Abbé Eugène Dushimimana", role_fr: "Économe du Diocèse", role_en: "Diocesan Bursar", role_rw: "Umubitsi wa Diyosezi" },
];

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "kabgayi",
  });
  console.log("✅  Connected");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS about_content (
      id                   INT AUTO_INCREMENT PRIMARY KEY,
      hero_title_fr        VARCHAR(300), hero_title_en VARCHAR(300), hero_title_rw VARCHAR(300),
      hero_subtitle_fr     VARCHAR(300), hero_subtitle_en VARCHAR(300), hero_subtitle_rw VARCHAR(300),
      diocese_tab_fr       VARCHAR(120), diocese_tab_en VARCHAR(120), diocese_tab_rw VARCHAR(120),
      bishop_tab_fr        VARCHAR(120), bishop_tab_en VARCHAR(120), bishop_tab_rw VARCHAR(120),
      diocese_title_fr     VARCHAR(300), diocese_title_en VARCHAR(300), diocese_title_rw VARCHAR(300),
      diocese_text_fr      LONGTEXT, diocese_text_en LONGTEXT, diocese_text_rw LONGTEXT,
      diocese_image        VARCHAR(500),
      stats_title_fr       VARCHAR(200), stats_title_en VARCHAR(200), stats_title_rw VARCHAR(200),
      stats_designation_fr VARCHAR(120), stats_designation_en VARCHAR(120), stats_designation_rw VARCHAR(120),
      stats_figure_fr      VARCHAR(120), stats_figure_en VARCHAR(120), stats_figure_rw VARCHAR(120),
      bishop_title_fr      VARCHAR(200), bishop_title_en VARCHAR(200), bishop_title_rw VARCHAR(200),
      bishop_role_fr       VARCHAR(200), bishop_role_en VARCHAR(200), bishop_role_rw VARCHAR(200),
      bishop_text_fr       LONGTEXT, bishop_text_en LONGTEXT, bishop_text_rw LONGTEXT,
      bishop_image         VARCHAR(500),
      collab_title_fr      VARCHAR(200), collab_title_en VARCHAR(200), collab_title_rw VARCHAR(200),
      updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  about_content table ready");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS about_stats (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      label_fr   VARCHAR(255), label_en VARCHAR(255), label_rw VARCHAR(255),
      value      VARCHAR(120),
      is_section TINYINT(1) DEFAULT 0,
      sort_order INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  about_stats table ready");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS about_collaborators (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(200),
      role_fr    VARCHAR(200), role_en VARCHAR(200), role_rw VARCHAR(200),
      sort_order INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log("✅  about_collaborators table ready");

  // Seed content (only once)
  const [cCount] = await conn.query("SELECT COUNT(*) as c FROM about_content");
  if (cCount[0].c === 0) {
    const keys = Object.keys(CONTENT);
    const cols = keys.join(",");
    const marks = keys.map(() => "?").join(",");
    await conn.query(
      `INSERT INTO about_content (${cols}) VALUES (${marks})`,
      keys.map((k) => CONTENT[k] || null)
    );
    console.log("✅  about_content seeded");
  }

  // Seed stats (only once)
  const [sCount] = await conn.query("SELECT COUNT(*) as c FROM about_stats");
  if (sCount[0].c === 0) {
    for (let i = 0; i < STATS.length; i++) {
      const s = STATS[i];
      await conn.query(
        `INSERT INTO about_stats (label_fr,label_en,label_rw,value,is_section,sort_order)
         VALUES (?,?,?,?,?,?)`,
        [s.label_fr, s.label_en, s.label_rw, s.value || null, s.is_section, i + 1]
      );
    }
    console.log(`✅  about_stats seeded (${STATS.length} rows)`);
  }

  // Seed collaborators (only once)
  const [collCount] = await conn.query("SELECT COUNT(*) as c FROM about_collaborators");
  if (collCount[0].c === 0) {
    for (let i = 0; i < COLLABORATORS.length; i++) {
      const p = COLLABORATORS[i];
      await conn.query(
        `INSERT INTO about_collaborators (name,role_fr,role_en,role_rw,sort_order)
         VALUES (?,?,?,?,?)`,
        [p.name, p.role_fr, p.role_en, p.role_rw, i + 1]
      );
    }
    console.log(`✅  about_collaborators seeded (${COLLABORATORS.length} rows)`);
  }

  await conn.end();
  console.log("\n🎉  About migration complete!");
}

// Allow this data to be reused by the SQL generator without connecting to MySQL.
module.exports = { CONTENT, STATS, COLLABORATORS };

if (require.main === module) {
  migrate().catch((e) => { console.error("❌", e.message); process.exit(1); });
}
