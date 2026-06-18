import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";
import ImageUpload from "../components/ImageUpload";

const EMPTY = {
  name:"", location:"", vicar:"", phone:"", email:"",
  image_url:"", description:"", sort_order:0, is_active:1,
};

const BACKEND = "http://localhost:5000";
const resolveUrl = (url) => (!url ? "" : url.startsWith("http") ? url : `${BACKEND}${url}`);

export default function ParishesPage() {
  const { t }               = useAdminLang();
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    api.getAllParishes()
      .then(setParishes)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...EMPTY, ...p }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await api.updateParish(editing, form);
      else         await api.createParish(form);
      showToast(editing ? t("user_updated") : t("user_created"));
      setModal(false); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette paroisse ?")) return;
    try { await api.deleteParish(id); showToast(t("deleted")); load(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">⛪ {t("parishes_title")}</div>
          <div className="page-sub">{t("parishes_sub")}</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>{t("new_parish")}</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{ height:200 }}><div className="admin-spinner" /></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th><th>{t("name_label")}</th><th>{t("location_col")}</th>
                  <th>{t("vicar_col")}</th><th>{t("status")}</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parishes.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="empty-state"><div className="empty-icon">⛪</div><p>{t("new_parish")}</p></div>
                  </td></tr>
                ) : parishes.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url
                        ? <img src={resolveUrl(p.image_url)} alt={p.name} className="img-preview" />
                        : <span style={{ fontSize:24 }}>⛪</span>
                      }
                    </td>
                    <td style={{ fontWeight:500 }}>{p.name}</td>
                    <td style={{ color:"var(--text-dim)", fontSize:13 }}>{p.location}</td>
                    <td style={{ fontSize:13 }}>{p.vicar || "—"}</td>
                    <td>
                      <span className={`badge ${p.is_active ? "badge-green" : "badge-gray"}`}>
                        {p.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:8 }}>
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

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth:720 }}>
            <div className="modal-header">
              <div className="modal-title">{editing ? t("edit_parish") : t("new_parish_f")}</div>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">

                  {/* Name — full width */}
                  <div className="form-group form-full">
                    <label className="form-label">{t("name_label")} <span>*</span></label>
                    <input className="form-input" value={form.name} onChange={set("name")} required />
                  </div>

                  {/* Location + Vicar */}
                  <div className="form-group">
                    <label className="form-label">{t("location_label")}</label>
                    <input className="form-input" value={form.location} onChange={set("location")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("vicar_label")}</label>
                    <input className="form-input" value={form.vicar} onChange={set("vicar")} />
                  </div>

                  {/* Phone + Email */}
                  <div className="form-group">
                    <label className="form-label">{t("phone_label")}</label>
                    <input className="form-input" value={form.phone} onChange={set("phone")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("email_label")}</label>
                    <input type="email" className="form-input" value={form.email} onChange={set("email")} />
                  </div>

                  {/* Image upload — full width */}
                  <div className="form-group form-full">
                    <ImageUpload
                      value={form.image_url}
                      onChange={(url) => setForm({ ...form, image_url: url })}
                      label={t("image_url")}
                      height={180}
                    />
                  </div>

                  {/* Description — full width */}
                  <div className="form-group form-full">
                    <label className="form-label">{t("desc_label")}</label>
                    <textarea className="form-input form-textarea" rows={3}
                      value={form.description} onChange={set("description")} />
                  </div>

                  {/* Order + Active */}
                  <div className="form-group">
                    <label className="form-label">{t("order_label")}</label>
                    <input type="number" className="form-input" value={form.sort_order}
                      onChange={set("sort_order")} min={0} />
                  </div>
                  <div className="form-group" style={{ justifyContent:"center", alignItems:"flex-start" }}>
                    <label className="form-label">{t("active_label")}</label>
                    <label className="toggle" style={{ marginTop:4 }}>
                      <input type="checkbox" checked={!!form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                </div>
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
