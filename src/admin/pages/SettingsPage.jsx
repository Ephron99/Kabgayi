import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";

export default function SettingsPage() {
  const { t }               = useAdminLang();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.getSettings()
      .then(setValues)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.saveSettings(values);
      showToast(t("settings_saved"));
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const FIELDS = [
    { section: t("general_info") },
    { key:"site_name_fr",   label:"Nom du site (FR)" },
    { key:"site_name_en",   label:"Site name (EN)" },
    { key:"site_name_rw",   label:"Izina ry'urubuga (RW)" },
    { key:"bishop_name",    label:"Évêque / Bishop / Umusenyeri" },
    { key:"bishop_role_fr", label:"Titre Évêque (FR)" },
    { key:"bishop_photo",   label:"Photo de l'Évêque", type:"image" },
    { section: t("contact_info") },
    { key:"phone",    label:"Téléphone / Phone" },
    { key:"email",    label:"Email" },
    { key:"address",  label:"Adresse / Address" },
    { section: t("social_media") },
    { key:"facebook",  label:"Facebook URL" },
    { key:"youtube",   label:"YouTube URL" },
    { key:"instagram", label:"Instagram URL" },
  ];

  if (loading) return (
    <div className="admin-loading" style={{ height:300 }}>
      <div className="admin-spinner" />
    </div>
  );

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">⚙️ {t("settings_title")}</div>
          <div className="page-sub">{t("settings_sub")}</div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="card">
          {FIELDS.map((f, i) => {
            if (f.section) return (
              <div key={i}>
                {i > 0 && <div className="divider" />}
                <div style={{
                  fontWeight:700, fontSize:12, color:"var(--text-dim)",
                  textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:16,
                }}>
                  {f.section}
                </div>
              </div>
            );

            // Image upload field
            if (f.type === "image") return (
              <div key={f.key} style={{ marginBottom:16 }}>
                <ImageUpload
                  value={values[f.key] || ""}
                  onChange={(url) => setValues({ ...values, [f.key]: url })}
                  label={f.label}
                  height={160}
                />
              </div>
            );

            // Regular text field
            return (
              <div key={f.key} className="form-group" style={{ marginBottom:14 }}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  value={values[f.key] || ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              </div>
            );
          })}

          <div className="divider" />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? t("saving") : t("save_settings")}
          </button>
        </div>
      </form>
    </div>
  );
}
