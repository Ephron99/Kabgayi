import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { showToast, ToastContainer } from "../components/Toast";

const EMPTY = { name:"", email:"", password:"", role:"editor" };

export default function UsersPage() {
  const { user: me }          = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    api.getUsers().then(setUsers).catch((e) => showToast(e.message,"error")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (u) => { setEditing(u.id); setForm({ ...EMPTY, ...u, password:"" }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await api.updateUser(editing, form);
      else         await api.createUser(form);
      showToast(editing ? "Utilisateur mis à jour" : "Utilisateur créé");
      setModal(false); load();
    } catch (err) { showToast(err.message,"error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (id === me?.id) return showToast("Vous ne pouvez pas supprimer votre propre compte","error");
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try { await api.deleteUser(id); showToast("Supprimé"); load(); }
    catch (e) { showToast(e.message,"error"); }
  };

  const roleColors = { superadmin:"badge-red", admin:"badge-blue", editor:"badge-green" };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">👥 Utilisateurs</div>
          <div className="page-sub">Gérez les accès au portail administratif</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nouvel utilisateur</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{height:200}}><div className="admin-spinner"/></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Créé le</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:32, height:32, background:"var(--red)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13, flexShrink:0 }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                        {u.id === me?.id && <span className="badge badge-gray">Moi</span>}
                      </div>
                    </td>
                    <td style={{fontSize:13,color:"var(--text-dim)"}}>{u.email}</td>
                    <td><span className={`badge ${roleColors[u.role]||"badge-gray"}`}>{u.role}</span></td>
                    <td style={{fontSize:12,color:"var(--text-dim)"}}>{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)} disabled={u.id===me?.id}>🗑️</button>
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
              <div className="modal-title">{editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</div>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom <span>*</span></label>
                    <input className="form-input" value={form.name} onChange={set("name")} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span>*</span></label>
                    <input type="email" className="form-input" value={form.email} onChange={set("email")} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{editing ? "Nouveau mot de passe" : "Mot de passe"} {!editing && <span>*</span>}</label>
                    <input type="password" className="form-input" value={form.password} onChange={set("password")} required={!editing} placeholder={editing?"Laisser vide pour ne pas changer":""} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rôle</label>
                    <select className="form-input form-select" value={form.role} onChange={set("role")}>
                      <option value="editor">Éditeur</option>
                      <option value="admin">Administrateur</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
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
