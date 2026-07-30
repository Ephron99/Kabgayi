import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";
import { BACKEND_BASE } from "../../config";
import { Building2, Edit2, Trash2 } from "lucide-react";

const EMPTY = {
  slug: "",
  section: "services",
  image_url: "",
  name_fr: "",
  name_en: "",
  name_rw: "",
  desc_fr: "",
  desc_en: "",
  desc_rw: "",
  sort_order: 0,
  is_active: 1
};

const resolveUrl = (url) => (!url ? "" : url.startsWith("https") ? url : `${BACKEND_BASE}${url}`);

export default function ServicesPage() {
  const { t } = useAdminLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getServices()
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
      icon: undefined // Remove icon since we're no longer using it
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.updateService(editing, form);
      else await api.createService(form);
      showToast(editing ? "Service modifié" : "Service créé");
      setModal(false);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce service ?")) return;
    try {
      await api.deleteService(id);
      showToast("Service supprimé");
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title" style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><Building2 /> Services Diocésains</div>
          <div className="page-sub">Gérer les services diocésains</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>Nouveau service</button>
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
                  <th>Section</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-icon"><Building2 size={48} /></div>
                        <p>Aucun service pour l'instant</p>
                      </div>
                    </td>
                  </tr>
                ) : items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url
                        ? <img src={resolveUrl(p.image_url)} alt={p.name_fr} className="img-preview" />
                        : <span style={{ fontSize: 24 }}><Building2 /></span>
                      }
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.name_fr}</td>
                    <td style={{ color: "var(--text-dim)", fontSize: 13 }}>{p.section}</td>
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
              <div className="modal-title">{editing ? "Modifier le service" : "Nouveau service"}</div>
              <button className="modal-close" onClick={() => setModal(false)}><span style={{fontSize:'24px'}}>×</span></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
            {/* Section & Slug */}
            <div className="form-group">
              <label className="form-label">Section <span>*</span></label>
              <select className="form-input" value={form.section} onChange={set("section")} required>
                <option value="services">Services</option>
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

                  {/* Descriptions */}
                  <div className="form-group form-full">
                    <label className="form-label">Description (FR)</label>
                    <textarea className="form-input form-textarea" rows={4} value={form.desc_fr} onChange={set("desc_fr")} />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">Description (EN)</label>
                    <textarea className="form-input form-textarea" rows={4} value={form.desc_en} onChange={set("desc_en")} />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">Description (RW)</label>
                    <textarea className="form-input form-textarea" rows={4} value={form.desc_rw} onChange={set("desc_rw")} />
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
