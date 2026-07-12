import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";

const EMPTY = {
  bishop_name: "Mgr Balthazar NTIVUGURUZWA",
  bishop_role_fr: "Évêque du Diocèse de Kabgayi",
  bishop_role_en: "Bishop of the Diocese of Kabgayi",
  bishop_role_rw: "Umusenyeri wa Diyosezi ya Kabgayi",
  photo_url: "",
  message_fr: "",
  message_en: "",
  message_rw: "",
};

export default function BishopPage() {
  const { t } = useAdminLang();
  const [form, setForm]       = useState(EMPTY);
  const [tab, setTab]         = useState("fr");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.getBishop()
      .then((d) => setForm({ ...EMPTY, ...d }))
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.saveBishop(form);
      showToast("Message de l'Évêque enregistré !");
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const langs = [
    { code:"fr", flag:"🇫🇷", label:"Français" },
    { code:"en", flag:"🇬🇧", label:"English" },
    { code:"rw", flag:"🇷🇼", label:"Kinyarwanda" },
  ];

  if (loading) return <div className="admin-loading" style={{height:300}}><div className="admin-spinner"/></div>;

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">✝ Message de l'Évêque</div>
          <div className="page-sub">Gérez le message et le profil de l'Évêque affiché sur la page d'accueil</div>
        </div>
        <button className="btn btn-primary" form="bishop-form" type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "💾 Enregistrer"}
        </button>
      </div>

      <form id="bishop-form" onSubmit={handleSave}>
        <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:24, alignItems:"start" }}>

          {/* Left — photo + identity */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div className="card">
              <div className="card-title">📸 Photo de l'Évêque</div>
              <ImageUpload
                value={form.photo_url}
                onChange={(url) => setForm({ ...form, photo_url: url })}
                label=""
                height={220}
              />
            </div>
            <div className="card">
              <div className="card-title">👤 Identité</div>
              <div className="form-group" style={{marginBottom:14}}>
                <label className="form-label">Nom <span>*</span></label>
                <input className="form-input" value={form.bishop_name} onChange={set("bishop_name")} required />
              </div>
              <div className="form-group" style={{marginBottom:14}}>
                <label className="form-label">Titre (FR)</label>
                <input className="form-input" value={form.bishop_role_fr} onChange={set("bishop_role_fr")} />
              </div>
              <div className="form-group" style={{marginBottom:14}}>
                <label className="form-label">Title (EN)</label>
                <input className="form-input" value={form.bishop_role_en} onChange={set("bishop_role_en")} />
              </div>
              <div className="form-group">
                <label className="form-label">Inshingano (RW)</label>
                <input className="form-input" value={form.bishop_role_rw} onChange={set("bishop_role_rw")} />
              </div>
            </div>
          </div>

          {/* Right — message in 3 languages */}
          <div className="card">
            <div className="card-title">✍️ Message</div>
            <div className="form-tabs">
              {langs.map(({ code, flag, label }) => (
                <button key={code} type="button"
                  className={`form-tab${tab === code ? " active" : ""}`}
                  onClick={() => setTab(code)}>
                  {flag} {label}
                </button>
              ))}
            </div>
            {langs.map(({ code }) => (
              <div key={code} style={{ display: tab === code ? "block" : "none" }}>
                <div className="form-group">
                  <label className="form-label">
                    Message {code === "fr" && <span>*</span>}
                  </label>
                  <textarea
                    className="form-input form-textarea"
                    value={form[`message_${code}`] || ""}
                    onChange={set(`message_${code}`)}
                    rows={12}
                    placeholder={
                      code === "fr"
                        ? "Saisissez le message de l'Évêque en français..."
                        : code === "en"
                        ? "Enter the Bishop's message in English..."
                        : "Andika ubutumwa bw'Umusenyeri mu Kinyarwanda..."
                    }
                    required={code === "fr"}
                  />
                </div>
              </div>
            ))}

            {/* Live preview */}
            {form.photo_url && (
              <div style={{ marginTop:24, padding:20, background:"var(--bg)", borderRadius:"var(--radius)", border:"1px solid var(--border)" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"var(--text-dim)", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>
                  APERÇU
                </div>
                <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <img
                    src={form.photo_url.startsWith("http") ? form.photo_url : `http://localhost:5000${form.photo_url}`}
                    alt=""
                    style={{ width:70, height:88, objectFit:"cover", borderRadius:6, border:"2px solid var(--red)", flexShrink:0 }}
                    onError={(e) => { e.target.style.display="none"; }}
                  />
                  <div>
                    <p style={{ fontStyle:"italic", fontSize:14, color:"var(--text-dark)", lineHeight:1.6, marginBottom:8 }}>
                      « {form.message_fr || "..."} »
                    </p>
                    <strong style={{ fontSize:13, color:"var(--navy)" }}>{form.bishop_name}</strong>
                    <p style={{ fontSize:12, color:"var(--red)", marginTop:2 }}>{form.bishop_role_fr}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
