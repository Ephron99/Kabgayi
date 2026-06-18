import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";

const FIELDS = [
  { section: "Informations générales" },
  { key:"site_name_fr",   label:"Nom du site (FR)" },
  { key:"site_name_en",   label:"Site name (EN)" },
  { key:"site_name_rw",   label:"Izina ry'urubuga (RW)" },
  { key:"bishop_name",    label:"Nom de l'Évêque" },
  { key:"bishop_role_fr", label:"Titre de l'Évêque (FR)" },
  { section: "Contact" },
  { key:"phone",   label:"Téléphone" },
  { key:"email",   label:"Email" },
  { key:"address", label:"Adresse" },
  { section: "Réseaux sociaux" },
  { key:"facebook",  label:"Facebook URL" },
  { key:"youtube",   label:"YouTube URL" },
  { key:"instagram", label:"Instagram URL" },
];

export default function SettingsPage() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.getSettings().then(setValues).catch((e) => showToast(e.message,"error")).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.saveSettings(values);
      showToast("Paramètres enregistrés !");
    } catch (err) { showToast(err.message,"error"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-loading" style={{height:300}}><div className="admin-spinner"/></div>;

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">⚙️ Paramètres du site</div>
          <div className="page-sub">Modifiez les informations générales du site</div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="card">
          {FIELDS.map((f, i) => {
            if (f.section) return (
              <div key={i}>
                {i > 0 && <div className="divider" />}
                <div style={{ fontWeight:700, fontSize:13, color:"var(--text-dim)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:16 }}>
                  {f.section}
                </div>
              </div>
            );
            return (
              <div key={f.key} className="form-group" style={{ marginBottom:16 }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" value={values[f.key] || ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              </div>
            );
          })}

          <div className="divider" />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Enregistrement..." : "💾 Enregistrer les paramètres"}
          </button>
        </div>
      </form>
    </div>
  );
}
