import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";

const EMPTY = {
  badge: "", image_url: "", sort_order: 0, is_active: 1,
  title_fr: "", title_en: "", title_rw: "",
  desc_fr: "",  desc_en: "",  desc_rw: "",
  points_fr: ["", "", ""], points_en: ["", "", ""], points_rw: ["", "", ""],
};

export default function HeroPage() {
  const [slides, setSlides]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [tab, setTab]         = useState("fr");
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    api.getHeroSlides()
      .then(setSlides)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setTab("fr"); setModal(true); };
  const openEdit = (s) => {
    setEditing(s.id);
    setForm({
      ...s,
      points_fr: Array.isArray(s.points_fr) ? [...s.points_fr] : ["","",""],
      points_en: Array.isArray(s.points_en) ? [...s.points_en] : ["","",""],
      points_rw: Array.isArray(s.points_rw) ? [...s.points_rw] : ["","",""],
    });
    setTab("fr"); setModal(true);
  };

  const setPoint = (lang, idx, val) => {
    setForm((f) => ({
      ...f,
      [`points_${lang}`]: f[`points_${lang}`].map((p, i) => i === idx ? val : p),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        points_fr: form.points_fr.filter(Boolean),
        points_en: form.points_en.filter(Boolean),
        points_rw: form.points_rw.filter(Boolean),
      };
      if (editing) await api.updateSlide(editing, payload);
      else         await api.createSlide(payload);
      showToast(editing ? "Slide mis à jour !" : "Slide créé !");
      setModal(false); load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette diapositive ?")) return;
    try {
      await api.deleteSlide(id);
      showToast("Supprimé");
      load();
    } catch (err) { showToast(err.message, "error"); }
  };

  const handleToggle = async (id) => {
    try { await api.toggleSlide(id); load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const langFlags = { fr: "🇫🇷 Français", en: "🇬🇧 English", rw: "🇷🇼 Kinyarwanda" };

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">🖼️ Slides Hero</div>
          <div className="page-sub">Gérez les diapositives de la section héro de la page d'accueil</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nouveau slide</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{ height: 200 }}><div className="admin-spinner" /></div>
        ) : slides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <p>Aucun slide. Créez le premier !</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Badge</th>
                  <th>Titre (FR)</th>
                  <th>Ordre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text-dim)", fontSize: 13 }}>{s.id}</td>
                    <td>
                      <img src={s.image_url} alt="" className="img-preview" />
                    </td>
                    <td>
                      <span className="badge badge-blue">{s.badge}</span>
                    </td>
                    <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                      {s.title_fr}
                    </td>
                    <td style={{ textAlign: "center" }}>{s.sort_order}</td>
                    <td>
                      <label className="toggle">
                        <input type="checkbox" checked={!!s.is_active} onChange={() => handleToggle(s.id)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ Modifier</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 760 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? "Modifier le slide" : "Nouveau slide"}</div>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Common fields */}
                <div className="form-grid" style={{ marginBottom: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Badge <span>*</span></label>
                    <input className="form-input" value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL de l'image <span>*</span></label>
                    <input className="form-input" value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ordre d'affichage</label>
                    <input type="number" className="form-input" value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
                  </div>
                  <div className="form-group" style={{ justifyContent: "center" }}>
                    {form.image_url && (
                      <img src={form.image_url} alt="preview"
                        style={{ height: 60, borderRadius: 6, objectFit: "cover", border: "1px solid var(--border)" }}
                        onError={(e) => { e.target.style.display = "none"; }} />
                    )}
                  </div>
                </div>

                <div className="divider" />

                {/* Language tabs */}
                <div className="form-tabs">
                  {Object.entries(langFlags).map(([code, label]) => (
                    <button key={code} type="button"
                      className={`form-tab${tab === code ? " active" : ""}`}
                      onClick={() => setTab(code)}>
                      {label}
                    </button>
                  ))}
                </div>

                {["fr","en","rw"].map((lang) => (
                  <div key={lang} style={{ display: tab === lang ? "block" : "none" }}>
                    <div className="form-grid">
                      <div className="form-group form-full">
                        <label className="form-label">Titre {lang === "fr" ? <span>*</span> : ""}</label>
                        <input className="form-input" value={form[`title_${lang}`]}
                          onChange={(e) => setForm({ ...form, [`title_${lang}`]: e.target.value })}
                          placeholder="Ligne 1\nLigne 2 (utilisez \n pour séparer)"
                          required={lang === "fr"} />
                      </div>
                      <div className="form-group form-full">
                        <label className="form-label">Description</label>
                        <textarea className="form-input form-textarea" value={form[`desc_${lang}`]}
                          onChange={(e) => setForm({ ...form, [`desc_${lang}`]: e.target.value })} />
                      </div>
                      {[0,1,2].map((i) => (
                        <div key={i} className="form-group">
                          <label className="form-label">Point {i + 1}</label>
                          <input className="form-input" value={form[`points_${lang}`][i] || ""}
                            onChange={(e) => setPoint(lang, i, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
