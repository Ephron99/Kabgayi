import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await login(form.email, form.password);
      nav("/", { replace: true });
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">✝</div>
          <div className="login-title">Portail Administratif</div>
          <div className="login-sub">Diocèse de Kabgayi</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Email <span>*</span></label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@diocesedekabgayi.org"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Mot de passe <span>*</span></label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
            style={{ width: "100%", justifyContent: "center", padding: "11px" }}
          >
            {busy ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text-dim)" }}>
          <div>Accès réservé au personnel autorisé</div>
          <div style={{ marginTop: 8, padding: "8px", background: "#F8FAFC", borderRadius: 6, border: "1px solid var(--border)" }}>
            <strong>Test:</strong> admin@diocesedekabgayi.org / Admin@Kabgayi2024
          </div>
        </div>
      </div>
    </div>
  );
}
