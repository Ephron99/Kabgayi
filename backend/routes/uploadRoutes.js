const router  = require("express").Router();
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");
const { auth } = require("../middleware/auth");

// ── ensure uploads folder exists ─────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── multer storage ────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req,  file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()
      .substring(0, 40);
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Type de fichier non autorisé. Formats acceptés: JPG, PNG, WebP, GIF, SVG"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
});

// POST /api/upload  — single image
router.post("/", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, size: req.file.size });
});

// DELETE /api/upload  — remove a file by filename
router.delete("/", auth, (req, res) => {
  const { filename } = req.body;
  if (!filename || filename.includes("..")) {
    return res.status(400).json({ error: "Nom de fichier invalide" });
  }
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ message: "Fichier supprimé" });
  }
  res.status(404).json({ error: "Fichier introuvable" });
});

// Error handler for multer
router.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ error: "Fichier trop volumineux (max 8 Mo)" });
  res.status(400).json({ error: err.message });
});

module.exports = router;
