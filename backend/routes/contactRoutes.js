const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// POST /api/contact  — public
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Champs requis: nom, email, message" });
  try {
    await db.query(
      "INSERT INTO contact_messages (name,email,subject,message) VALUES (?,?,?,?)",
      [name, email, subject||null, message]
    );
    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/contact  — admin
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/contact/:id/read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    await db.query("UPDATE contact_messages SET is_read=1 WHERE id=?", [req.params.id]);
    res.json({ message: "Marqué comme lu" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/contact/:id
router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM contact_messages WHERE id=?", [req.params.id]);
    res.json({ message: "Message supprimé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
