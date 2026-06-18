const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/settings  — public (safe to expose)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT setting_key, value FROM settings");
    const obj = {};
    rows.forEach((r) => { obj[r.setting_key] = r.value; });
    res.json(obj);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/settings  — bulk upsert
router.put("/", auth, requireRole("superadmin","admin"), async (req, res) => {
  const entries = Object.entries(req.body);
  if (!entries.length) return res.status(400).json({ error: "Aucun paramètre fourni" });
  try {
    for (const [key, value] of entries) {
      await db.query(
        "INSERT INTO settings (setting_key,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?",
        [key, value, value]
      );
    }
    res.json({ message: "Paramètres mis à jour" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
