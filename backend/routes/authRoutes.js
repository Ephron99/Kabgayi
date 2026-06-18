const router   = require("express").Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const db       = require("../db/connection");
const { auth } = require("../middleware/auth");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email et mot de passe requis" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_users WHERE email = ?", [email]
    );
    if (!rows.length)
      return res.status(401).json({ error: "Identifiants incorrects" });

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Identifiants incorrects" });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id,name,email,role,avatar,created_at FROM admin_users WHERE id=?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/password  (change own password)
router.put("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Champs requis" });
  try {
    const [rows] = await db.query("SELECT * FROM admin_users WHERE id=?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "Utilisateur introuvable" });
    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE admin_users SET password=? WHERE id=?", [hashed, req.user.id]);
    res.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
