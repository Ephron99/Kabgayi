const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/hero  — public, returns active slides ordered
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM hero_slides WHERE is_active=1 ORDER BY sort_order ASC"
    );
    // Parse JSON fields
    const slides = rows.map((s) => ({
      ...s,
      points_fr: safeJson(s.points_fr),
      points_en: safeJson(s.points_en),
      points_rw: safeJson(s.points_rw),
      // alias for frontend compatibility
      titleFr: s.title_fr, titleEn: s.title_en, titleRw: s.title_rw,
      descFr:  s.desc_fr,  descEn:  s.desc_en,  descRw:  s.desc_rw,
      image:   s.image_url,
      points:  { fr: safeJson(s.points_fr), en: safeJson(s.points_en), rw: safeJson(s.points_rw) },
    }));
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/hero/all  — admin, all slides incl. inactive
router.get("/all", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero_slides ORDER BY sort_order ASC");
    res.json(rows.map(parseSlide));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/hero  — create
router.post("/", auth, requireRole("superadmin","admin"), async (req, res) => {
  const { badge, image_url, title_fr, title_en, title_rw,
          desc_fr, desc_en, desc_rw, points_fr, points_en, points_rw,
          sort_order, is_active } = req.body;
  if (!badge || !image_url || !title_fr || !desc_fr)
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  try {
    const [result] = await db.query(
      `INSERT INTO hero_slides
       (badge,image_url,title_fr,title_en,title_rw,desc_fr,desc_en,desc_rw,
        points_fr,points_en,points_rw,sort_order,is_active)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [ badge, image_url, title_fr, title_en||null, title_rw||null,
        desc_fr, desc_en||null, desc_rw||null,
        JSON.stringify(points_fr||[]), JSON.stringify(points_en||[]), JSON.stringify(points_rw||[]),
        sort_order||0, is_active??1 ]
    );
    res.status(201).json({ id: result.insertId, message: "Diapositive créée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/hero/:id  — update
router.put("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  const { id } = req.params;
  const { badge, image_url, title_fr, title_en, title_rw,
          desc_fr, desc_en, desc_rw, points_fr, points_en, points_rw,
          sort_order, is_active } = req.body;
  try {
    await db.query(
      `UPDATE hero_slides SET badge=?,image_url=?,title_fr=?,title_en=?,title_rw=?,
       desc_fr=?,desc_en=?,desc_rw=?,points_fr=?,points_en=?,points_rw=?,
       sort_order=?,is_active=? WHERE id=?`,
      [ badge, image_url, title_fr, title_en||null, title_rw||null,
        desc_fr, desc_en||null, desc_rw||null,
        JSON.stringify(points_fr||[]), JSON.stringify(points_en||[]), JSON.stringify(points_rw||[]),
        sort_order||0, is_active??1, id ]
    );
    res.json({ message: "Diapositive mise à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/hero/:id
router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM hero_slides WHERE id=?", [req.params.id]);
    res.json({ message: "Diapositive supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/hero/:id/toggle  — toggle active
router.patch("/:id/toggle", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query(
      "UPDATE hero_slides SET is_active = NOT is_active WHERE id=?", [req.params.id]
    );
    res.json({ message: "Statut modifié" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function safeJson(val) {
  try { return typeof val === "string" ? JSON.parse(val) : val || []; }
  catch { return []; }
}
function parseSlide(s) {
  return {
    ...s,
    points_fr: safeJson(s.points_fr),
    points_en: safeJson(s.points_en),
    points_rw: safeJson(s.points_rw),
  };
}

module.exports = router;
