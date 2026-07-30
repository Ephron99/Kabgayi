import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";
import { BACKEND_BASE } from "../../config";
import { Church, Edit2, Trash2 } from "lucide-react";

const EMPTY = {
  parent_id: null,
  slug: "",
  name_fr: "",
  name_en: "",
  name_rw: "",
  image_url: "",
  moto_fr: "",
  moto_en: "",
  moto_rw: "",
  saint_patron_fr: "",
  saint_patron_en: "",
  saint_patron_rw: "",
  date_fondation: "",
  directeur_name_fr: "",
  directeur_name_en: "",
  directeur_name_rw: "",
  directeur_contact: "",
  sort_order: 0,
  is_active: 1
};

const resolveUrl = (url) => (!url ? "" : url.startsWith("https") ? url : `${BACKEND_BASE}${url}`);

export default function PastoralPage() {
  const { t } = useAdminLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getPastoralItems()
      .then(setItems)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      ...EMPTY,
      ...p,
      date_fondation: p.date_fondation ? new Date(p.date_fondation).toISOString().split('T')[0] : ""
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.updatePastoralItem(editing, form);
      else await api.createPastoralItem(form);
      showToast(editing ? "Item modifié" : "Item créé");
      setModal(false);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet item pastoral ?")) return;
    try {
      await api.deletePastoralItem(id);
      showToast("Item supprimé");
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const parentOptions = items.filter(item => !item.parent_id); // Only top-level items as parents

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title" style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><Church /> Pastoral</div>
          <div className="page-sub">Gérer les items pastoraux et sous-menu</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>Nouvel item</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{ height: 200 }}>
            <div className="admin-spinner" />
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom (FR)</th>
                  <th>Parent</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-icon"><Church size={48} /></div>
                        <p>Aucun item pastoral pour l'instant</p>
                      </div>
                    </td>
                  </tr>
                ) : items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url
                        ? <img src={resolveUrl(p.image_url)} alt={p.name_fr} className="img-preview" />
                        : <span style={{ fontSize: 24 }}><Church /></span>
                      }
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.name_fr}</td>
                    <td style={{ color: "var(--text-dim)", fontSize: 13 }}>
                      {p.parent_id ? items.find(i => i.id === p.parent_id)?.name_fr : "—"}
                    </td>
                    <td>
                      <span className={`badge ${p.is_active ? "badge-green" : "badge-gray"}`}>
                        {p.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Edit2 size={16} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
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
          <div className="modal" style={{ maxWidth: 900 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? "Modifier l'item pastoral" : "Nouvel item pastoral"}</div>
              <button className="modal-close" onClick={() => setModal(false)}><span style={{fontSize:'24px'}}>×</span></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Parent & Slug */}
                  <div className="form-group">
                    <label className="form-label">Parent</label>
                    <select className="form-input" value={form.parent_id || ""} onChange={(e) => setForm({ ...form, parent_id: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">Aucun (menu principal)</option>
                      {parentOptions.map(item => <option key={item.id} value={item.id}>{item.name_fr}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug <span>*</span></label>
                    <input className="form-input" value={form.slug} onChange={set("slug")} required />
                  </div>

                  {/* Names */}
                  <div className="form-group">
                    <label className="form-label">Nom (FR) <span>*</span></label>
                    <input className="form-input" value={form.name_fr} onChange={set("name_fr")} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom (EN)</label>
                    <input className="form-input" value={form.name_en} onChange={set("name_en")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom (RW)</label>
                    <input className="form-input" value={form.name_rw} onChange={set("name_rw")} />
                  </div>

                  {/* Image */}
                  <div className="form-group form-full">
                    <ImageUpload
                      value={form.image_url}
                      onChange={(url) => setForm({ ...form, image_url: url })}
                      label="Image"
                      height={180}
                    />
                  </div>

                  {/* Mottos */}
                  <div className="form-group form-full">
                    <label className="form-label">Motto (FR)</label>
                    <textarea className="form-input form-textarea" rows={2} value={form.moto_fr} onChange={set("moto_fr")} />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">Motto (EN)</label>
                    <textarea className="form-input form-textarea" rows={2} value={form.moto_en} onChange={set("moto_en")} />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">Motto (RW)</label>
                    <textarea className="form-input form-textarea" rows={2} value={form.moto_rw} onChange={set("moto_rw")} />
                  </div>

                  {/* Saint Patron */}
                  <div className="form-group">
                    <label className="form-label">Saint Patron (FR)</label>
                    <input className="form-input" value={form.saint_patron_fr} onChange={set("saint_patron_fr")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Saint Patron (EN)</label>
                    <input className="form-input" value={form.saint_patron_en} onChange={set("saint_patron_en")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Saint Patron (RW)</label>
                    <input className="form-input" value={form.saint_patron_rw} onChange={set("saint_patron_rw")} />
                  </div>

                  {/* Date fondation */}
                  <div className="form-group">
                    <label className="form-label">Date de fondation</label>
                    <input type="date" className="form-input" value={form.date_fondation} onChange={set("date_fondation")} />
                  </div>

                  {/* Directeur */}
                  <div className="form-group">
                    <label className="form-label">Nom du directeur (FR)</label>
                    <input className="form-input" value={form.directeur_name_fr} onChange={set("directeur_name_fr")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom du directeur (EN)</label>
                    <input className="form-input" value={form.directeur_name_en} onChange={set("directeur_name_en")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom du directeur (RW)</label>
                    <input className="form-input" value={form.directeur_name_rw} onChange={set("directeur_name_rw")} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact du directeur</label>
                    <input className="form-input" value={form.directeur_contact} onChange={set("directeur_contact")} />
                  </div>

                  {/* Order & Active */}
                  <div className="form-group">
                    <label className="form-label">Ordre</label>
                    <input type="number" className="form-input" value={form.sort_order} onChange={set("sort_order")} min={0} />
                  </div>
                  <div className="form-group" style={{ justifyContent: "center", alignItems: "flex-start" }}>
                    <label className="form-label">Actif</label>
                    <label className="toggle" style={{ marginTop: 4 }}>
                      <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
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