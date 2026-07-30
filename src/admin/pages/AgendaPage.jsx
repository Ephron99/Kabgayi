import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import { Calendar, Edit2, Trash2 } from "lucide-react";

const EMPTY = {
  day:"", month_fr:"", month_en:"", month_rw:"",
  title_fr:"", title_en:"", title_rw:"",
  place_fr:"", place_en:"", place_rw:"",
  event_date:"", sort_order:0, is_active:1,
};

const MONTHS_FR = ["JANVIER","FÉVRIER","MARS","AVRIL","MAI","JUIN","JUILLET","AOÛT","SEPTEMBRE","OCTOBRE","NOVEMBRE","DÉCEMBRE"];
const MONTHS_EN = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
const MONTHS_RW = ["MUTARAMA","GASHYANTARE","WERURWE","MATA","GICURASI","KAMENA","NYAKANGA","KANAMA","NZELI","UKWAKIRA","UGUSHYINGO","UKUBOZA"];

export default function AgendaPage() {
  const { t } = useAdminLang();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [tab, setTab]         = useState("fr");
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    api.getAgenda()
      .then(setEvents)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setTab("fr"); setModal(true); };
  const openEdit = (ev) => { setEditing(ev.id); setForm({ ...EMPTY, ...ev }); setTab("fr"); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await api.updateEvent(editing, form);
      else         await api.createEvent(form);
      showToast(editing ? "Événement mis à jour" : "Événement créé");
      setModal(false); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet événement ?")) return;
    try { await api.deleteEvent(id); showToast("Supprimé"); load(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Auto-fill EN/RW months when FR month changes
  const handleMonthFr = (e) => {
    const val = e.target.value.toUpperCase();
    const idx = MONTHS_FR.indexOf(val);
    setForm({
      ...form,
      month_fr: val,
      month_en: idx >= 0 ? MONTHS_EN[idx] : form.month_en,
      month_rw: idx >= 0 ? MONTHS_RW[idx] : form.month_rw,
    });
  };

  const langs = [
    { code:"fr", flag:"🇫🇷", label:"Français" },
    { code:"en", flag:"🇬🇧", label:"English" },
    { code:"rw", flag:"🇷🇼", label:"Kinyarwanda" },
  ];

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title" style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><Calendar /> Agenda Pastoral</div>
          <div className="page-sub">Gérez les événements affichés dans l'agenda pastoral de la page d'accueil</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nouvel événement</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{height:200}}><div className="admin-spinner"/></div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Calendar size={48} /></div>
            <p>Aucun événement. Créez le premier !</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Titre (FR)</th>
                  <th>Lieu (FR)</th>
                  <th>Ordre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <div className="agenda-admin-date">
                        <span className="agenda-admin-day">{ev.day}</span>
                        <span className="agenda-admin-month">{ev.month_fr}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight:500, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {ev.title_fr}
                    </td>
                    <td style={{ fontSize:13, color:"var(--text-dim)" }}>{ev.place_fr || "—"}</td>
                    <td style={{ textAlign:"center" }}>{ev.sort_order}</td>
                    <td>
                      <span className={`badge ${ev.is_active ? "badge-green" : "badge-gray"}`}>
                        {ev.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}><Edit2 size={16} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.id)}><Trash2 size={16} /></button>
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
          <div className="modal" style={{ maxWidth:680 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? "Modifier l'événement" : "Nouvel événement"}</div>
              <button className="modal-close" onClick={() => setModal(false)}><span style={{fontSize:'24px'}}>×</span></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">

                {/* Day / Month / Date / Order */}
                <div className="form-grid" style={{ marginBottom:20 }}>
                  <div className="form-group">
                    <label className="form-label">Jour <span>*</span></label>
                    <input className="form-input" value={form.day}
                      onChange={set("day")} placeholder="ex: 25" maxLength={2} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mois (FR) <span>*</span></label>
                    <select className="form-input form-select" value={form.month_fr} onChange={handleMonthFr} required>
                      <option value="">— Choisir —</option>
                      {MONTHS_FR.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date complète</label>
                    <input type="date" className="form-input" value={form.event_date || ""}
                      onChange={set("event_date")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ordre d'affichage</label>
                    <input type="number" className="form-input" value={form.sort_order}
                      onChange={set("sort_order")} min={0} />
                  </div>
                </div>

                <div className="divider" />

                {/* Language tabs */}
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
                    <div className="form-grid">
                      {code !== "fr" && (
                        <div className="form-group">
                          <label className="form-label">Mois ({code.toUpperCase()})</label>
                          <input className="form-input" value={form[`month_${code}`] || ""}
                            onChange={set(`month_${code}`)} />
                        </div>
                      )}
                      <div className={`form-group${code !== "fr" ? "" : " form-full"}`}>
                        <label className="form-label">Titre {code === "fr" && <span>*</span>}</label>
                        <input className="form-input" value={form[`title_${code}`] || ""}
                          onChange={set(`title_${code}`)} required={code === "fr"} />
                      </div>
                      <div className="form-group form-full">
                        <label className="form-label">Lieu</label>
                        <input className="form-input" value={form[`place_${code}`] || ""}
                          onChange={set(`place_${code}`)} />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="divider" />
                <div className="form-group" style={{ flexDirection:"row", alignItems:"center", gap:12 }}>
                  <label className="toggle">
                    <input type="checkbox" checked={!!form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ fontSize:14 }}>Événement actif (visible sur le site)</span>
                </div>
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
