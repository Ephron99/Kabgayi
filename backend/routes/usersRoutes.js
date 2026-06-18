const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const db      = require("../db/connection");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/users  — superadmin only
router.get("/", auth, requireRole("superadmin"), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id,name,email,role,avatar,created_at FROM admin_users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/users  — create new admin
router.post("/", auth, requireRole("superadmin"), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Nom, email et mot de passe requis" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [r] = await db.query(
      "INSERT INTO admin_users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashed, role||"editor"]
    );
    res.status(201).json({ id: r.insertId, message: "Utilisateur créé" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Email déjà utilisé" });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id
router.put("/:id", auth, requireRole("superadmin"), async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await db.query("UPDATE admin_users SET name=?,email=?,role=?,password=? WHERE id=?",
        [name, email, role, hashed, req.params.id]);
    } else {
      await db.query("UPDATE admin_users SET name=?,email=?,role=? WHERE id=?",
        [name, email, role, req.params.id]);
    }
    res.json({ message: "Utilisateur mis à jour" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/users/:id
router.delete("/:id", auth, requireRole("superadmin"), async (req, res) => {
  if (String(req.params.id) === String(req.user.id))
    return res.status(400).json({ error: "Impossible de supprimer votre propre compte" });
  try {
    await db.query("DELETE FROM admin_users WHERE id=?", [req.params.id]);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
