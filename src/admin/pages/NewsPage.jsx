import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";
import { useAdminLang } from "../context/AdminLangContext";

export default function NewsPage() {
  const { t } = useAdminLang();
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getAllNews().then(setNews).catch((e) => showToast(e.message, "error")).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer?")) return;
    try { await api.deleteNews(id); showToast(t("deleted")); load(); }
    catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div><div className="page-title">📰 {t("news_title")}</div><div className="page-sub">{t("news_sub")}</div></div>
        <Link to="/admin/news/new" className="btn btn-primary">{t("new_article")}</Link>
      </div>
      <div className="card">
        {loading ? <div className="admin-loading" style={{ height:200 }}><div className="admin-spinner" /></div>
        : news.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📰</div><p><Link to="/admin/news/new" style={{color:"var(--red)"}}>{t("new_article")}</Link></p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Image</th><th>{t("title_col")}</th><th>{t("category_col")}</th><th>{t("author_col")}</th><th>{t("status")}</th><th>{t("date")}</th><th>Actions</th></tr></thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>{n.image_url ? <img src={n.image_url} alt="" className="img-preview" /> : <div style={{width:60,height:45,background:"var(--bg)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📰</div>}</td>
                    <td style={{maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{n.title_fr}</td>
                    <td>{n.category_fr && <span className="badge badge-blue">{n.category_fr}</span>}</td>
                    <td style={{fontSize:13,color:"var(--text-dim)"}}>{n.author_name||"—"}</td>
                    <td><span className={`badge ${n.is_published?"badge-green":"badge-yellow"}`}>{n.is_published?t("published"):t("draft")}</span></td>
                    <td style={{fontSize:12,color:"var(--text-dim)",whiteSpace:"nowrap"}}>{new Date(n.created_at).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <div style={{display:"flex",gap:8}}>
                        <Link to={`/admin/news/${n.id}`} className="btn btn-secondary btn-sm">✏️</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
