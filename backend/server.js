require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://diocesekabgayi.rw",
    "http://diocesekabgayi.rw",
    "http://backendi.smartdealerltd.com",
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/upload",   require("./routes/uploadRoutes"));
app.use("/api/hero",     require("./routes/heroRoutes"));
app.use("/api/news",     require("./routes/newsRoutes"));
app.use("/api/parishes", require("./routes/parishRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/contact",  require("./routes/contactRoutes"));
app.use("/api/users",    require("./routes/usersRoutes"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

// 404
app.use((req, res) =>
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀  Backend running at http://localhost:${PORT}`);
  console.log(`📋  API docs: http://localhost:${PORT}/api/health`);
});
