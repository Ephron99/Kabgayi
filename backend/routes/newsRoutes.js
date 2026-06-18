const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/news  — public, published only
router.get("/", async (req, res) => {
  try {
    const limit  = parseInt(req.query.limit)  || 20;
    const offset = parseInt(req.query.offset) || 0;
    const [rows] = await db.query(
      `SELECT n.*, u.name as author_name
       FROM news n LEFT JOIN admin_users u ON n.author_id=u.id
       WHERE n.is_published=1
       ORDER BY n.published_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [count] = await db.query("SELECT COUNT(*) as total FROM news WHERE is_published=1");
    res.json({ data: rows, total: count[0].total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/news/all  — admin
router.get("/all", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT n.*, u.name as author_name
       FROM news n LEFT JOIN admin_users u ON n.author_id=u.id
       ORDER BY n.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/news/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM news WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Article introuvable" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/news
router.post("/", auth, requireRole("superadmin","admin","editor"), async (req, res) => {
  const { category_fr, category_en, category_rw,
          title_fr, title_en, title_rw,
          excerpt_fr, excerpt_en, excerpt_rw,
          content_fr, content_en, content_rw,
          image_url, is_published } = req.body;
  if (!title_fr) return res.status(400).json({ error: "Titre requis" });
  try {
    const pub = is_published ? new Date() : null;
    const [result] = await db.query(
      `INSERT INTO news (category_fr,category_en,category_rw,title_fr,title_en,title_rw,
       excerpt_fr,excerpt_en,excerpt_rw,content_fr,content_en,content_rw,
       image_url,author_id,is_published,published_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [ category_fr,category_en||null,category_rw||null,
        title_fr,title_en||null,title_rw||null,
        excerpt_fr||null,excerpt_en||null,excerpt_rw||null,
        content_fr||null,content_en||null,content_rw||null,
        image_url||null, req.user.id, is_published?1:0, pub ]
    );
    res.status(201).json({ id: result.insertId, message: "Article créé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/news/:id
router.put("/:id", auth, requireRole("superadmin","admin","editor"), async (req, res) => {
  const { category_fr, category_en, category_rw,
          title_fr, title_en, title_rw,
          excerpt_fr, excerpt_en, excerpt_rw,
          content_fr, content_en, content_rw,
          image_url, is_published } = req.body;
  try {
    const [existing] = await db.query("SELECT published_at FROM news WHERE id=?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: "Article introuvable" });
    const pub = is_published && !existing[0].published_at ? new Date() : existing[0].published_at;
    await db.query(
      `UPDATE news SET category_fr=?,category_en=?,category_rw=?,
       title_fr=?,title_en=?,title_rw=?,
       excerpt_fr=?,excerpt_en=?,excerpt_rw=?,
       content_fr=?,content_en=?,content_rw=?,
       image_url=?,is_published=?,published_at=? WHERE id=?`,
      [ category_fr,category_en||null,category_rw||null,
        title_fr,title_en||null,title_rw||null,
        excerpt_fr||null,excerpt_en||null,excerpt_rw||null,
        content_fr||null,content_en||null,content_rw||null,
        image_url||null, is_published?1:0, pub, req.params.id ]
    );
    res.json({ message: "Article mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/news/:id
router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM news WHERE id=?", [req.params.id]);
    res.json({ message: "Article supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
