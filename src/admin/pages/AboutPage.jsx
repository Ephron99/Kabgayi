import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import ImageUpload from "../components/ImageUpload";
import { Save, Church, User, Users, Table2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const LANGS = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "rw", flag: "🇷🇼", label: "Kinyarwanda" },
];

export default function AboutPage() {
  const [tab, setTab]                 = useState("fr");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [content, setContent]         = useState({});
  const [stats, setStats]             = useState([]);
  const [collaborators, setCollab]    = useState([]);

  useEffect(() => {
    api.getAbout()
      .then((d) => {
        setContent(d.content || {});
        setStats(d.stats || []);
        setCollab(d.collaborators || []);
      })
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const setC = (k) => (e) => setContent({ ...content, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveAbout({ content, stats, collaborators });
      showToast("Page À Propos enregistrée !");
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  // Generic list helpers (reorder / remove)
  const move = (arr, setter, i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setter(copy);
  };

  const updateStat = (i, patch) => setStats(stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStat    = () => setStats([...stats, { label_fr: "", label_en: "", label_rw: "", value: "", is_section: 0 }]);
  const removeStat = (i) => setStats(stats.filter((_, idx) => idx !== i));

  const updateCollab = (i, patch) => setCollab(collaborators.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const addCollab    = () => setCollab([...collaborators, { name: "", role_fr: "", role_en: "", role_rw: "" }]);
  const removeCollab = (i) => setCollab(collaborators.filter((_, idx) => idx !== i));

  if (loading) return <div className="admin-loading" style={{ height: 300 }}><div className="admin-spinner" /></div>;

  const rowBtn = { padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" };

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Church /> Page À Propos
          </div>
          <div className="page-sub">Gérez le contenu de la page « À Propos » affichée sur le site public</div>
        </div>
        <button className="btn btn-primary" form="about-form" type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : <><Save size={16} /> Enregistrer</>}
        </button>
      </div>

      {/* Language tabs */}
      <div className="form-tabs" style={{ marginBottom: 20 }}>
        {LANGS.map(({ code, flag, label }) => (
          <button key={code} type="button"
            className={`form-tab${tab === code ? " active" : ""}`}
            onClick={() => setTab(code)}>
            {flag} {label}
          </button>
        ))}
      </div>

      <form id="about-form" onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Diocese ── */}
          <div className="card">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Church /> Le Diocèse
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Titre de la page (hero)</label>
              <input className="form-input" value={content[`hero_title_${tab}`] || ""} onChange={setC(`hero_title_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Sous-titre (hero)</label>
              <input className="form-input" value={content[`hero_subtitle_${tab}`] || ""} onChange={setC(`hero_subtitle_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Libellé de l'onglet</label>
              <input className="form-input" value={content[`diocese_tab_${tab}`] || ""} onChange={setC(`diocese_tab_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Titre de la section</label>
              <input className="form-input" value={content[`diocese_title_${tab}`] || ""} onChange={setC(`diocese_title_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Texte de présentation</label>
              <textarea className="form-input form-textarea" rows={12}
                value={content[`diocese_text_${tab}`] || ""} onChange={setC(`diocese_text_${tab}`)} />
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
                Séparez les paragraphes par une ligne vide.
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Image du diocèse</label>
              <ImageUpload
                value={content.diocese_image || ""}
                onChange={(url) => setContent({ ...content, diocese_image: url })}
                label=""
                height={160}
              />
            </div>
          </div>

          {/* ── Bishop ── */}
          <div className="card">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User /> Notre Évêque
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Libellé de l'onglet</label>
              <input className="form-input" value={content[`bishop_tab_${tab}`] || ""} onChange={setC(`bishop_tab_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Nom</label>
              <input className="form-input" value={content[`bishop_title_${tab}`] || ""} onChange={setC(`bishop_title_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Titre / fonction</label>
              <input className="form-input" value={content[`bishop_role_${tab}`] || ""} onChange={setC(`bishop_role_${tab}`)} />
            </div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Biographie</label>
              <textarea className="form-input form-textarea" rows={8}
                value={content[`bishop_text_${tab}`] || ""} onChange={setC(`bishop_text_${tab}`)} />
            </div>
            <div className="form-group">
              <label className="form-label">Photo de l'Évêque</label>
              <ImageUpload
                value={content.bishop_image || ""}
                onChange={(url) => setContent({ ...content, bishop_image: url })}
                label=""
                height={160}
              />
            </div>
          </div>
        </div>

        {/* ── Statistics ── */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Table2 /> Statistiques du Diocèse
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div className="form-group">
              <label className="form-label">Titre du tableau</label>
              <input className="form-input" value={content[`stats_title_${tab}`] || ""} onChange={setC(`stats_title_${tab}`)} />
            </div>
            <div className="form-group">
              <label className="form-label">En-tête colonne 1</label>
              <input className="form-input" value={content[`stats_designation_${tab}`] || ""} onChange={setC(`stats_designation_${tab}`)} />
            </div>
            <div className="form-group">
              <label className="form-label">En-tête colonne 2</label>
              <input className="form-input" value={content[`stats_figure_${tab}`] || ""} onChange={setC(`stats_figure_${tab}`)} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 160px auto", gap: 10, alignItems: "center",
                padding: 10, border: "1px solid var(--border)", borderRadius: "var(--radius)",
                background: s.is_section ? "rgba(139,0,0,0.05)" : "transparent",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input className="form-input" placeholder={`Intitulé (${tab.toUpperCase()})`}
                    value={s[`label_${tab}`] || ""} onChange={(e) => updateStat(i, { [`label_${tab}`]: e.target.value })} />
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-dim)" }}>
                    <input type="checkbox" checked={!!s.is_section}
                      onChange={(e) => updateStat(i, { is_section: e.target.checked ? 1 : 0 })} />
                    Ligne de section (en-tête de groupe)
                  </label>
                </div>
                <input className="form-input" placeholder="Chiffre" disabled={!!s.is_section}
                  value={s.value || ""} onChange={(e) => updateStat(i, { value: e.target.value })} />
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" className="btn btn-secondary btn-sm" style={rowBtn} onClick={() => move(stats, setStats, i, -1)}><ArrowUp size={14} /></button>
                  <button type="button" className="btn btn-secondary btn-sm" style={rowBtn} onClick={() => move(stats, setStats, i, 1)}><ArrowDown size={14} /></button>
                  <button type="button" className="btn btn-danger btn-sm" style={rowBtn} onClick={() => removeStat(i)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={addStat}>
            <Plus size={16} /> Ajouter une ligne
          </button>
        </div>

        {/* ── Collaborators ── */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users /> {content[`collab_title_${tab}`] || "Collaborateurs"}
          </div>

          <div className="form-group" style={{ marginBottom: 18, maxWidth: 400 }}>
            <label className="form-label">Titre de la liste</label>
            <input className="form-input" value={content[`collab_title_${tab}`] || ""} onChange={setC(`collab_title_${tab}`)} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {collaborators.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "center",
                padding: 10, border: "1px solid var(--border)", borderRadius: "var(--radius)",
              }}>
                <input className="form-input" placeholder="Nom"
                  value={c.name || ""} onChange={(e) => updateCollab(i, { name: e.target.value })} />
                <input className="form-input" placeholder={`Fonction (${tab.toUpperCase()})`}
                  value={c[`role_${tab}`] || ""} onChange={(e) => updateCollab(i, { [`role_${tab}`]: e.target.value })} />
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" className="btn btn-secondary btn-sm" style={rowBtn} onClick={() => move(collaborators, setCollab, i, -1)}><ArrowUp size={14} /></button>
                  <button type="button" className="btn btn-secondary btn-sm" style={rowBtn} onClick={() => move(collaborators, setCollab, i, 1)}><ArrowDown size={14} /></button>
                  <button type="button" className="btn btn-danger btn-sm" style={rowBtn} onClick={() => removeCollab(i)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={addCollab}>
            <Plus size={16} /> Ajouter un collaborateur
          </button>
        </div>
      </form>
    </div>
  );
}
