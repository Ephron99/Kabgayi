require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();

// ── Middleware ──────────────────────────────────────────────
// Allow all origins — handles any subdomain or www variant
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const allowed = [
      "https://diocesekabgayi.rw",
      "http://diocesekabgayi.rw",
      "https://www.diocesekabgayi.rw",
      "http://www.diocesekabgayi.rw",
      "https://backendi.smartdealerltd.com",
      "http://backendi.smartdealerltd.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ];
    if (allowed.includes(origin)) return callback(null, true);
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
// cors middleware above handles OPTIONS preflight automatically
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀  Backend running on port ${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/api/health`);
});
