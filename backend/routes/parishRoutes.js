const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM parishes WHERE is_active=1 ORDER BY sort_order ASC, name ASC"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/all", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM parishes ORDER BY sort_order ASC, name ASC");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM parishes WHERE id=?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Paroisse introuvable" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", auth, requireRole("superadmin","admin"), async (req, res) => {
  const { name, location, vicar, phone, email, image_url, description, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: "Nom requis" });
  try {
    const [r] = await db.query(
      "INSERT INTO parishes (name,location,vicar,phone,email,image_url,description,sort_order) VALUES (?,?,?,?,?,?,?,?)",
      [name, location||null, vicar||null, phone||null, email||null, image_url||null, description||null, sort_order||0]
    );
    res.status(201).json({ id: r.insertId, message: "Paroisse créée" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  const { name, location, vicar, phone, email, image_url, description, sort_order, is_active } = req.body;
  try {
    await db.query(
      "UPDATE parishes SET name=?,location=?,vicar=?,phone=?,email=?,image_url=?,description=?,sort_order=?,is_active=? WHERE id=?",
      [name, location||null, vicar||null, phone||null, email||null, image_url||null, description||null, sort_order||0, is_active??1, req.params.id]
    );
    res.json({ message: "Paroisse mise à jour" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM parishes WHERE id=?", [req.params.id]);
    res.json({ message: "Paroisse supprimée" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
