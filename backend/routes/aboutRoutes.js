const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/about — public. Returns the About page content, stats and collaborators.
router.get("/", async (req, res) => {
  try {
    const [contentRows] = await db.query("SELECT * FROM about_content ORDER BY id LIMIT 1");
    const [stats]       = await db.query("SELECT * FROM about_stats ORDER BY sort_order ASC, id ASC");
    const [collab]      = await db.query("SELECT * FROM about_collaborators ORDER BY sort_order ASC, id ASC");
    res.json({ content: contentRows[0] || {}, stats, collaborators: collab });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Allowed content columns (whitelist to avoid mass-assignment on unknown fields)
const CONTENT_COLS = [
  "hero_title_fr","hero_title_en","hero_title_rw",
  "hero_subtitle_fr","hero_subtitle_en","hero_subtitle_rw",
  "diocese_tab_fr","diocese_tab_en","diocese_tab_rw",
  "bishop_tab_fr","bishop_tab_en","bishop_tab_rw",
  "diocese_title_fr","diocese_title_en","diocese_title_rw",
  "diocese_text_fr","diocese_text_en","diocese_text_rw",
  "diocese_image",
  "stats_title_fr","stats_title_en","stats_title_rw",
  "stats_designation_fr","stats_designation_en","stats_designation_rw",
  "stats_figure_fr","stats_figure_en","stats_figure_rw",
  "bishop_title_fr","bishop_title_en","bishop_title_rw",
  "bishop_role_fr","bishop_role_en","bishop_role_rw",
  "bishop_text_fr","bishop_text_en","bishop_text_rw",
  "bishop_image",
  "collab_title_fr","collab_title_en","collab_title_rw",
];

// PUT /api/about — admin. Upserts content and replaces stats + collaborators.
router.put("/", auth, requireRole("superadmin","admin","editor"), async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { content = {}, stats = [], collaborators = [] } = req.body;

    await conn.beginTransaction();

    // ── Content (single row upsert) ──
    const values = CONTENT_COLS.map((c) => content[c] || null);
    const [existing] = await conn.query("SELECT id FROM about_content ORDER BY id LIMIT 1");
    if (existing.length) {
      const sets = CONTENT_COLS.map((c) => `${c}=?`).join(",");
      await conn.query(`UPDATE about_content SET ${sets} WHERE id=?`, [...values, existing[0].id]);
    } else {
      await conn.query(
        `INSERT INTO about_content (${CONTENT_COLS.join(",")}) VALUES (${CONTENT_COLS.map(() => "?").join(",")})`,
        values
      );
    }

    // ── Stats (replace all) ──
    await conn.query("DELETE FROM about_stats");
    for (let i = 0; i < stats.length; i++) {
      const s = stats[i];
      await conn.query(
        `INSERT INTO about_stats (label_fr,label_en,label_rw,value,is_section,sort_order)
         VALUES (?,?,?,?,?,?)`,
        [s.label_fr || null, s.label_en || null, s.label_rw || null,
         s.value || null, s.is_section ? 1 : 0, i + 1]
      );
    }

    // ── Collaborators (replace all) ──
    await conn.query("DELETE FROM about_collaborators");
    for (let i = 0; i < collaborators.length; i++) {
      const p = collaborators[i];
      await conn.query(
        `INSERT INTO about_collaborators (name,role_fr,role_en,role_rw,sort_order)
         VALUES (?,?,?,?,?)`,
        [p.name || null, p.role_fr || null, p.role_en || null, p.role_rw || null, i + 1]
      );
    }

    await conn.commit();
    res.json({ message: "Page À Propos mise à jour" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
