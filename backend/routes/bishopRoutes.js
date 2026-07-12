const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/bishop  — public
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bishop_message LIMIT 1");
    res.json(rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/bishop  — admin upsert
router.put("/", auth, requireRole("superadmin","admin","editor"), async (req, res) => {
  const { message_fr, message_en, message_rw, photo_url,
          bishop_name, bishop_role_fr, bishop_role_en, bishop_role_rw } = req.body;
  try {
    const [rows] = await db.query("SELECT id FROM bishop_message LIMIT 1");
    if (rows.length) {
      await db.query(
        `UPDATE bishop_message SET message_fr=?,message_en=?,message_rw=?,
         photo_url=?,bishop_name=?,bishop_role_fr=?,bishop_role_en=?,bishop_role_rw=?
         WHERE id=?`,
        [message_fr,message_en,message_rw,photo_url||null,
         bishop_name,bishop_role_fr,bishop_role_en,bishop_role_rw, rows[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO bishop_message (message_fr,message_en,message_rw,photo_url,
         bishop_name,bishop_role_fr,bishop_role_en,bishop_role_rw)
         VALUES (?,?,?,?,?,?,?,?)`,
        [message_fr,message_en,message_rw,photo_url||null,
         bishop_name,bishop_role_fr,bishop_role_en,bishop_role_rw]
      );
    }
    res.json({ message: "Message de l'Évêque mis à jour" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
