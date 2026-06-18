import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";

const EMPTY = {
  category_fr:"", category_en:"", category_rw:"",
  title_fr:"",    title_en:"",    title_rw:"",
  excerpt_fr:"",  excerpt_en:"",  excerpt_rw:"",
  content_fr:"",  content_en:"",  content_rw:"",
  image_url:"",   is_published: false,
};

export default function NewsForm() {
  const { id }  = useParams();
  const nav     = useNavigate();
  const isEdit  = !!id;
  const [form, setForm]   = useState(EMPTY);
  const [tab, setTab]     = useState("fr");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.getNews(id)
      .then((n) => setForm({ ...EMPTY, ...n, is_published: !!n.is_published }))
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (published) => {
    setSaving(true);
    try {
      const payload = { ...form, is_published: published };
      if (isEdit) await api.updateNews(id, payload);
      else        await api.createNews(payload);
      showToast(published ? "Publié avec succès !" : "Brouillon sauvegardé");
      nav("/news");
    } catch (e) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const langs = [
    { code: "fr", label: "🇫🇷 Français" },
    { code: "en", label: "🇬🇧 English" },
    { code: "rw", label: "🇷🇼 Kinyarwanda" },
  ];

  if (loading) return <div className="admin-loading" style={{ height: 300 }}><div className="admin-spinner" /></div>;

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? "Modifier l'article" : "Nouvel article"}</div>
          <div className="page-sub"><Link to="/news" style={{ color: "var(--red)" }}>← Actualités</Link></div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => handleSave(false)} disabled={saving}>
            💾 Brouillon
          </button>
          <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={saving}>
            🚀 {saving ? "Enregistrement..." : "Publier"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Main content */}
        <div className="card">
          <div className="form-tabs">
            {langs.map(({ code, label }) => (
              <button key={code} type="button"
                className={`form-tab${tab === code ? " active" : ""}`}
                onClick={() => setTab(code)}>
                {label}
              </button>
            ))}
          </div>

          {langs.map(({ code }) => (
            <div key={code} style={{ display: tab === code ? "block" : "none" }}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Catégorie</label>
                <input className="form-input" value={form[`category_${code}`]} onChange={set(`category_${code}`)}
                  placeholder="ex: ORDINATION, PÈLERINAGE..." />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Titre {code === "fr" && <span>*</span>}</label>
                <input className="form-input" value={form[`title_${code}`]} onChange={set(`title_${code}`)}
                  required={code === "fr"} />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Résumé</label>
                <textarea className="form-input form-textarea" value={form[`excerpt_${code}`]}
                  onChange={set(`excerpt_${code}`)} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Contenu complet</label>
                <textarea className="form-input form-textarea" value={form[`content_${code}`]}
                  onChange={set(`content_${code}`)} rows={12} />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-title">🖼️ Image</div>
            <div className="form-group">
              <label className="form-label">URL de l'image</label>
              <input className="form-input" value={form.image_url} onChange={set("image_url")}
                placeholder="https://..." />
            </div>
            {form.image_url && (
              <img src={form.image_url} alt=""
                style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6, marginTop: 12, border: "1px solid var(--border)" }}
                onError={(e) => { e.target.style.display = "none"; }} />
            )}
          </div>

          <div className="card">
            <div className="card-title">⚙️ Options</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label className="toggle">
                <input type="checkbox" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: 14 }}>Publier immédiatement</span>
            </div>
            <div className="divider" />
            <button className="btn btn-danger btn-sm" style={{ width: "100%", justifyContent: "center" }}
              onClick={() => { if(confirm("Supprimer ?")) { api.deleteNews(id).then(() => nav("/news")); } }}>
              🗑️ Supprimer l'article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
