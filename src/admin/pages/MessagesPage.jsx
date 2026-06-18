import { useEffect, useState } from "react";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";

export default function MessagesPage() {
  const { t }              = useAdminLang();
  const [msgs, setMsgs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => { setLoading(true); api.getMessages().then(setMsgs).catch((e) => showToast(e.message,"error")).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleRead = async (id) => { try { await api.markRead(id); load(); } catch(e) { showToast(e.message,"error"); } };
  const handleDelete = async (id) => {
    if (!confirm("Supprimer?")) return;
    try { await api.deleteMessage(id); showToast(t("deleted")); setSelected(null); load(); } catch(e) { showToast(e.message,"error"); }
  };
  const unread = msgs.filter((m) => !m.is_read).length;

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div><div className="page-title">✉️ {t("msgs_title")}</div><div className="page-sub">{unread} {t("unread")}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:20,alignItems:"start"}}>
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? <div className="admin-loading" style={{height:200}}><div className="admin-spinner"/></div>
          : msgs.length===0 ? <div className="empty-state"><div className="empty-icon">📭</div><p>{t("no_messages")}</p></div>
          : msgs.map((m) => (
            <div key={m.id}
              onClick={() => { setSelected(m); if(!m.is_read) handleRead(m.id); }}
              style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",cursor:"pointer",background:selected?.id===m.id?"rgba(139,0,0,.05)":m.is_read?"#fff":"#FFFBEB",borderLeft:selected?.id===m.id?"3px solid var(--red)":"3px solid transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <strong style={{fontSize:14,color:m.is_read?"var(--text-dark)":"var(--red)"}}>{m.name}</strong>
                <span style={{fontSize:11,color:"var(--text-dim)"}}>{new Date(m.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <div style={{fontSize:13,color:"var(--text-dim)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.subject||t("no_subject")}</div>
              {!m.is_read && <span className="badge badge-blue" style={{marginTop:4}}>{t("new_msg")}</span>}
            </div>
          ))}
        </div>
        {selected ? (
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>{selected.subject||t("no_subject")}</div>
                <div style={{fontSize:13,color:"var(--text-dim)"}}>{t("from")} : <strong>{selected.name}</strong> — <a href={`mailto:${selected.email}`} style={{color:"var(--red)"}}>{selected.email}</a></div>
                <div style={{fontSize:12,color:"var(--text-dim)",marginTop:3}}>{new Date(selected.created_at).toLocaleString("fr-FR")}</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>{t("delete_msg")}</button>
            </div>
            <div className="divider"/>
            <p style={{lineHeight:1.8,fontSize:15,color:"var(--text)",whiteSpace:"pre-wrap"}}>{selected.message}</p>
            <div className="divider"/>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject||""}`} className="btn btn-primary btn-sm">{t("reply_email")}</a>
          </div>
        ) : (
          <div className="card"><div className="empty-state"><div className="empty-icon">✉️</div><p>{t("select_msg")}</p></div></div>
        )}
      </div>
    </div>
  );
}
