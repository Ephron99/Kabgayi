import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminLang } from "../context/AdminLangContext";

const LANG_OPTIONS = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "rw", flag: "🇷🇼", label: "Kinyarwanda" },
];

export default function LoginPage() {
  const { login }          = useAdminAuth();
  const { t, lang, setLang } = useAdminLang();
  const nav                = useNavigate();
  const [form, setForm]    = useState({ email: "", password: "" });
  const [error, setError]  = useState("");
  const [busy, setBusy]    = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await login(form.email, form.password);
      nav("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      {/* Language switcher — top right */}
      <div className="login-lang-bar">
        {LANG_OPTIONS.map(({ code, flag, label }) => (
          <button
            key={code}
            className={`login-lang-btn${lang === code ? " active" : ""}`}
            onClick={() => setLang(code)}
            title={label}
          >
            {flag} <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">✝</div>
          <div className="login-title">{t("admin_portal")}</div>
          <div className="login-sub">{t("diocese")}</div>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert">
            <span>⚠️ </span>{error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" htmlFor="email">
              {t("email")} <span>*</span>
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@diocesedekabgayi.org"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" htmlFor="password">
              {t("password")} <span>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", color: "var(--text-dim)",
                  fontSize: 17, padding: 0,
                }}
                aria-label={showPw ? "Masquer" : "Afficher"}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }}
          >
            {busy ? (
              <><span className="login-spinner" /> {t("signing_in")}</>
            ) : t("sign_in")}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>{t("restricted")}</p>
          <Link to="/" className="login-back-link">
            🌐 {t("back_site")}
          </Link>
        </div>
      </div>
    </div>
  );
}
