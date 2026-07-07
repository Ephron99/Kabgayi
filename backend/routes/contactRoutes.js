const router    = require("express").Router();
const db        = require("../db/connection");
const nodemailer = require("nodemailer");
const { auth, requireRole } = require("../middleware/auth");

// ── Email transporter ────────────────────────────────────────
// Uses your hosting SMTP. If not configured, it falls back to
// a no-op so the form still saves to DB without crashing.
function createTransporter() {
  // You can change host/port/auth to match your cPanel SMTP
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || "mail.diocesekabgayi.rw",
    port:   parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE !== "false", // true for 465
    auth: {
      user: process.env.SMTP_USER || "noreply@diocesekabgayi.rw",
      pass: process.env.SMTP_PASS || "",
    },
    tls: { rejectUnauthorized: false },
  });
}

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "uwitonzejmv@yahoo.fr";

async function sendNotification(msg) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"Diocèse de Kabgayi - Site Web" <${process.env.SMTP_USER || "noreply@diocesekabgayi.rw"}>`,
      to:      NOTIFY_EMAIL,
      subject: `📩 Nouveau message : ${msg.subject || "(sans sujet)"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="background:#8B0000;padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:18px;">Nouveau message depuis le site</h2>
            <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:13px;">Diocèse de Kabgayi – Formulaire de contact</p>
          </div>
          <div style="padding:24px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:8px 0;font-weight:700;color:#374151;width:120px;">Nom</td>
                <td style="padding:8px 0;color:#111827;">${msg.name}</td>
              </tr>
              <tr style="background:#f9fafb;">
                <td style="padding:8px;font-weight:700;color:#374151;">Email</td>
                <td style="padding:8px;"><a href="mailto:${msg.email}" style="color:#8B0000;">${msg.email}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;color:#374151;">Sujet</td>
                <td style="padding:8px 0;color:#111827;">${msg.subject || "(sans sujet)"}</td>
              </tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#f3f4f6;border-radius:6px;border-left:4px solid #8B0000;">
              <p style="font-weight:700;color:#374151;margin:0 0 8px;font-size:13px;">MESSAGE :</p>
              <p style="color:#374151;line-height:1.7;margin:0;white-space:pre-wrap;">${msg.message}</p>
            </div>
            <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
              <p style="margin:0;">Répondre directement à : <a href="mailto:${msg.email}" style="color:#8B0000;">${msg.email}</a></p>
              <p style="margin:4px 0 0;">Message reçu le ${new Date().toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </div>
      `,
      replyTo: msg.email,
    });
    console.log(`✅  Notification email sent to ${NOTIFY_EMAIL}`);
  } catch (err) {
    // Don't crash the request if email fails — just log it
    console.error("⚠️  Email notification failed:", err.message);
  }
}

// ── POST /api/contact — public ───────────────────────────────
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Champs requis: nom, email, message" });

  try {
    // Save to database
    await db.query(
      "INSERT INTO contact_messages (name,email,subject,message) VALUES (?,?,?,?)",
      [name, email, subject || null, message]
    );

    // Send email notification (non-blocking)
    sendNotification({ name, email, subject, message });

    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/contact — admin ─────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/contact/:id/read ──────────────────────────────
router.patch("/:id/read", auth, async (req, res) => {
  try {
    await db.query("UPDATE contact_messages SET is_read=1 WHERE id=?", [req.params.id]);
    res.json({ message: "Marqué comme lu" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE /api/contact/:id ──────────────────────────────────
router.delete("/:id", auth, requireRole("superadmin","admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM contact_messages WHERE id=?", [req.params.id]);
    res.json({ message: "Message supprimé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
