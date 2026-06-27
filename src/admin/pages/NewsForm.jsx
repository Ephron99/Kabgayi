import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";
import { Save, Rocket, Image, Settings, Trash2, Reply } from "lucide-react";
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
  const { t }   = useAdminLang();
  const isEdit  = !!id && id !== "new";

  const [form, setForm]       = useState(EMPTY);
  const [tab, setTab]         = useState("fr");
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
      showToast(published ? t("published_ok") : t("draft_ok"));
      nav("/admin/news");
    } catch (e) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const langs = [
    { code:"fr", flag:"🇫🇷", label:"Français"     },
    { code:"en", flag:"🇬🇧", label:"English"       },
    { code:"rw", flag:"🇷🇼", label:"Kinyarwanda"   },
  ];

  if (loading) return (
    <div className="admin-loading" style={{ height: 300 }}>
      <div className="admin-spinner" />
    </div>
  );

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? t("edit_article") : t("new_article_f")}</div>
          <div className="page-sub">
            <Link to="/admin/news" style={{ color:"var(--red)" }}>{t("back_news")}</Link>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-secondary" onClick={() => handleSave(false)} disabled={saving}>
            <Save size={16} />Draft
          </button>
          <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={saving}>
            {saving ? t("publishing") : <Rocket size={16} />}publish
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:24 }}>

        {/* ── Main content ── */}
        <div className="card">
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
              <div className="form-group" style={{ marginBottom:16 }}>
                <label className="form-label">{t("category")}</label>
                <input className="form-input" value={form[`category_${code}`]}
                  onChange={set(`category_${code}`)} placeholder={t("cat_ph")} />
              </div>
              <div className="form-group" style={{ marginBottom:16 }}>
                <label className="form-label">
                  {t("title_label")} {code === "fr" && <span>*</span>}
                </label>
                <input className="form-input" value={form[`title_${code}`]}
                  onChange={set(`title_${code}`)} required={code === "fr"} />
              </div>
              <div className="form-group" style={{ marginBottom:16 }}>
                <label className="form-label">{t("excerpt")}</label>
                <textarea className="form-input form-textarea" rows={3}
                  value={form[`excerpt_${code}`]} onChange={set(`excerpt_${code}`)} />
              </div>
              <div className="form-group">
                <label className="form-label">{t("full_content")}</label>
                <textarea className="form-input form-textarea" rows={12}
                  value={form[`content_${code}`]} onChange={set(`content_${code}`)} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Image upload */}
          <div className="card">
            <div className="card-title"><Image size={18} /></div>
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              label=""
              height={180}
            />
          </div>

          {/* Publish options */}
          <div className="card">
            <div className="card-title"><Settings size={18} /></div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <label className="toggle">
                <input type="checkbox" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize:14 }}>{t("publish_now")}</span>
            </div>
            {isEdit && (
              <>
                <div className="divider" />
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ width:"100%", justifyContent:"center" }}
                  onClick={() => {
                    if (confirm("Supprimer cet article ?"))
                      api.deleteNews(id).then(() => nav("/admin/news"));
                  }}
                >
                  <Trash2 size={16} /> 
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
