const router = require("express").Router();
const db     = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/agenda  — public, active events ordered
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM agenda_events WHERE is_active=1 ORDER BY sort_order ASC, event_date ASC LIMIT 6"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/agenda/all  — admin
router.get("/all", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM agenda_events ORDER BY sort_order ASC, event_date ASC");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/agenda
router.post("/", auth, requireRole("superadmin","admin","editor"), async (req, res) => {
  const { day,month_fr,month_en,month_rw,title_fr,title_en,title_rw,
          place_fr,place_en,place_rw,event_date,sort_order } = req.body;
  if (!day || !month_fr || !title_fr)
    return res.status(400).json({ error: "Champs requis: jour, mois, titre" });
  try {
    const [r] = await db.query(
      `INSERT INTO agenda_events (day,month_fr,month_en,month_rw,title_fr,title_en,title_rw,
       place_fr,place_en,place_rw,event_date,sort_order)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [day,month_fr,month_en||null,month_rw||null,
       title_fr,title_en||null,title_rw||null,
       place_fr||null,place_en||null,place_rw||null,
       event_date||null, sort_order||0]
    );
    res.status(201).json({ id: r.insertId, message: "Événement créé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/agenda/:id
router.put("/:id", auth, requireRole("superadmin","admin","editor"), async (req, res) => {
  const { day,month_fr,month_en,month_rw,title_fr,title_en,title_rw,
          place_fr,place_en,place_rw,event_date,sort_order,is_active } = req.body;
  try {
    await db.query(
      `UPDATE agenda_events SET day=?,month_fr=?,month_en=?,month_rw=?,
       title_fr=?,title_en=?,title_rw=?,place_fr=?,place_en=?,place_rw=?,
       event_date=?,sort_order=?,is_active=? WHERE id=?`,
      [day,month_fr,month_en||null,month_rw||null,
       title_fr,title_en||null,title_rw||null,
       place_fr||null,place_en||null,place_rw||null,
       event_date||null,sort_order||0,is_active??1, req.params.id]
    );
    res.json({ message: "Événement mis à jour" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/agenda/:id
router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM agenda_events WHERE id=?", [req.params.id]);
    res.json({ message: "Événement supprimé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
