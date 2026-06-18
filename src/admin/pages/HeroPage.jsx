import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";

const EMPTY = {
  badge: "", image_url: "", sort_order: 0, is_active: 1,
  title_fr: "", title_en: "", title_rw: "",
  desc_fr:  "", desc_en:  "", desc_rw:  "",
  points_fr: ["","",""], points_en: ["","",""], points_rw: ["","",""],
};

const BACKEND = "http://localhost:5000";
const resolveUrl = (url) => (!url ? "" : url.startsWith("http") ? url : `${BACKEND}${url}`);

export default function HeroPage() {
  const { t } = useAdminLang();
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

  const openNew = () => {
    setEditing(null); setForm(EMPTY); setTab("fr"); setModal(true);
  };
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

  const setPoint = (lang, idx, val) =>
    setForm((f) => ({
      ...f,
      [`points_${lang}`]: f[`points_${lang}`].map((p, i) => (i === idx ? val : p)),
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image_url) { showToast("Veuillez choisir une image", "error"); return; }
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
      showToast(t("saved")); setModal(false); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("delete_confirm"))) return;
    try { await api.deleteSlide(id); showToast(t("deleted")); load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const handleToggle = async (id) => {
    try { await api.toggleSlide(id); load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  const langTabs = [
    { code:"fr", flag:"🇫🇷", label:"Français" },
    { code:"en", flag:"🇬🇧", label:"English"  },
    { code:"rw", flag:"🇷🇼", label:"Kinyarwanda" },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">🖼️ {t("hero_title")}</div>
          <div className="page-sub">{t("hero_sub")}</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>{t("new_slide")}</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{ height: 200 }}><div className="admin-spinner" /></div>
        ) : slides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <p>{t("new_slide")}</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openNew}>{t("new_slide")}</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Image</th><th>{t("badge")}</th>
                  <th>{t("title_label")} (FR)</th><th>{t("display_order")}</th>
                  <th>{t("status")}</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((s) => (
                  <tr key={s.id}>
                    <td style={{ color:"var(--text-dim)", fontSize:13 }}>{s.id}</td>
                    <td>
                      <img
                        src={resolveUrl(s.image_url)}
                        alt={s.title_fr}
                        className="img-preview"
                      />
                    </td>
                    <td><span className="badge badge-blue">{s.badge}</span></td>
                    <td style={{ maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500 }}>
                      {s.title_fr}
                    </td>
                    <td style={{ textAlign:"center" }}>{s.sort_order}</td>
                    <td>
                      <label className="toggle">
                        <input type="checkbox" checked={!!s.is_active} onChange={() => handleToggle(s.id)} />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ {t("save")}</button>
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

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 780 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? t("edit_slide") : t("new_slide_form")}</div>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">

                {/* ── Top row: badge + order ── */}
                <div className="form-grid" style={{ marginBottom: 20 }}>
                  <div className="form-group">
                    <label className="form-label">{t("badge")} <span>*</span></label>
                    <input
                      className="form-input"
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      placeholder="ex: DIOCÈSE DE KABGAYI"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("display_order")}</label>
                    <input
                      type="number"
                      className="form-input"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: +e.target.value })}
                      min={0}
                    />
                  </div>
                </div>

                {/* ── Image upload ── */}
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  label={t("image_url")}
                  required
                  height={200}
                />

                <div className="divider" />

                {/* ── Language tabs ── */}
                <div className="form-tabs">
                  {langTabs.map(({ code, flag, label }) => (
                    <button
                      key={code} type="button"
                      className={`form-tab${tab === code ? " active" : ""}`}
                      onClick={() => setTab(code)}
                    >
                      {flag} {label}
                    </button>
                  ))}
                </div>

                {langTabs.map(({ code }) => (
                  <div key={code} style={{ display: tab === code ? "block" : "none" }}>
                    <div className="form-grid">
                      <div className="form-group form-full">
                        <label className="form-label">
                          {t("title_label")} {code === "fr" && <span>*</span>}
                        </label>
                        <input
                          className="form-input"
                          value={form[`title_${code}`]}
                          onChange={(e) => setForm({ ...form, [`title_${code}`]: e.target.value })}
                          placeholder="Ligne 1&#10;Ligne 2"
                          required={code === "fr"}
                        />
                      </div>
                      <div className="form-group form-full">
                        <label className="form-label">{t("description")}</label>
                        <textarea
                          className="form-input form-textarea"
                          value={form[`desc_${code}`]}
                          onChange={(e) => setForm({ ...form, [`desc_${code}`]: e.target.value })}
                          rows={3}
                        />
                      </div>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="form-group">
                          <label className="form-label">{t("point")} {i + 1}</label>
                          <input
                            className="form-input"
                            value={form[`points_${code}`][i] || ""}
                            onChange={(e) => setPoint(code, i, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>
                  {t("cancel")}
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? t("saving") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
