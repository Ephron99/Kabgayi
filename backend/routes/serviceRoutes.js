const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM services WHERE is_active=1 ORDER BY sort_order ASC, name_fr ASC"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/all", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services ORDER BY sort_order ASC, name_fr ASC");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services WHERE slug=? AND is_active=1", [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: "Service introuvable" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", auth, requireRole("superadmin","admin"), async (req, res) => {
  const { slug, section, image_url, name_fr, name_en, name_rw, desc_fr, desc_en, desc_rw, sort_order, is_active } = req.body;
  if (!slug || !section || !name_fr) return res.status(400).json({ error: "Slug, section et nom en français requis" });
  try {
    const [r] = await db.query(
      "INSERT INTO services (slug,section,image_url,name_fr,name_en,name_rw,desc_fr,desc_en,desc_rw,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [slug, section, image_url||null, name_fr, name_en||null, name_rw||null, desc_fr||null, desc_en||null, desc_rw||null, sort_order||0, is_active??1]
    );
    res.status(201).json({ id: r.insertId, message: "Service créé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  const { slug, section, image_url, name_fr, name_en, name_rw, desc_fr, desc_en, desc_rw, sort_order, is_active } = req.body;
  try {
    await db.query(
      "UPDATE services SET slug=?,section=?,image_url=?,name_fr=?,name_en=?,name_rw=?,desc_fr=?,desc_en=?,desc_rw=?,sort_order=?,is_active=? WHERE id=?",
      [slug, section, image_url||null, name_fr, name_en||null, name_rw||null, desc_fr||null, desc_en||null, desc_rw||null, sort_order||0, is_active??1, req.params.id]
    );
    res.json({ message: "Service mis à jour" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM services WHERE id=?", [req.params.id]);
    res.json({ message: "Service supprimé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
