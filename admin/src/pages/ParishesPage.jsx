import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";

const EMPTY = { name:"", location:"", vicar:"", phone:"", email:"", image_url:"", description:"", sort_order:0, is_active:1 };

export default function ParishesPage() {
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    api.getAllParishes().then(setParishes).catch((e) => showToast(e.message,"error")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...EMPTY, ...p }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await api.updateParish(editing, form);
      else         await api.createParish(form);
      showToast(editing ? "Paroisse mise à jour" : "Paroisse créée");
      setModal(false); load();
    } catch (err) { showToast(err.message,"error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette paroisse ?")) return;
    try { await api.deleteParish(id); showToast("Supprimé"); load(); }
    catch (e) { showToast(e.message,"error"); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">⛪ Paroisses</div>
          <div className="page-sub">Gérez les paroisses du diocèse</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nouvelle paroisse</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{ height: 200 }}><div className="admin-spinner" /></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Image</th><th>Nom</th><th>Lieu</th><th>Vicaire</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {parishes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.image_url ? <img src={p.image_url} alt="" className="img-preview" /> : <span style={{fontSize:24}}>⛪</span>}</td>
                    <td style={{ fontWeight:500 }}>{p.name}</td>
                    <td style={{ color:"var(--text-dim)",fontSize:13 }}>{p.location}</td>
                    <td style={{ fontSize:13 }}>{p.vicar || "—"}</td>
                    <td><span className={`badge ${p.is_active ? "badge-green" : "badge-gray"}`}>{p.is_active ? "Active" : "Inactive"}</span></td>
                    <td>
                      <div style={{ display:"flex",gap:8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target===e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? "Modifier la paroisse" : "Nouvelle paroisse"}</div>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Nom <span>*</span></label>
                    <input className="form-input" value={form.name} onChange={set("name")} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lieu</label>
                    <input className="form-input" value={form.location} onChange={set("location")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vicaire / Curé</label>
                    <input className="form-input" value={form.vicar} onChange={set("vicar")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input className="form-input" value={form.phone} onChange={set("phone")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={set("email")} />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">URL de l'image</label>
                    <input className="form-input" value={form.image_url} onChange={set("image_url")} />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">Description</label>
                    <textarea className="form-input form-textarea" value={form.description} onChange={set("description")} rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ordre</label>
                    <input type="number" className="form-input" value={form.sort_order} onChange={set("sort_order")} />
                  </div>
                  <div className="form-group" style={{ justifyContent:"center" }}>
                    <label className="form-label">Active</label>
                    <label className="toggle">
                      <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({...form,is_active:e.target.checked?1:0})} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Enregistrement...":"Enregistrer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
