import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { showToast, ToastContainer } from "../components/Toast";

export default function NewsPage() {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getAllNews()
      .then(setNews)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet article ?")) return;
    try { await api.deleteNews(id); showToast("Article supprimé"); load(); }
    catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div>
      <ToastContainer />
      <div className="page-header">
        <div>
          <div className="page-title">📰 Actualités</div>
          <div className="page-sub">Gérez les articles publiés sur le site</div>
        </div>
        <Link to="/news/new" className="btn btn-primary">+ Nouvel article</Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="admin-loading" style={{ height: 200 }}><div className="admin-spinner" /></div>
        ) : news.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📰</div>
            <p>Aucun article. <Link to="/news/new" style={{ color: "var(--red)" }}>Créez le premier !</Link></p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Auteur</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>
                      {n.image_url
                        ? <img src={n.image_url} alt="" className="img-preview" />
                        : <div style={{ width: 60, height: 45, background: "var(--bg)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📰</div>
                      }
                    </td>
                    <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                      {n.title_fr}
                    </td>
                    <td>
                      {n.category_fr && <span className="badge badge-blue">{n.category_fr}</span>}
                    </td>
                    <td style={{ fontSize: 13, color: "var(--text-dim)" }}>{n.author_name || "—"}</td>
                    <td>
                      <span className={`badge ${n.is_published ? "badge-green" : "badge-yellow"}`}>
                        {n.is_published ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                      {new Date(n.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link to={`/news/${n.id}`} className="btn btn-secondary btn-sm">✏️</Link>
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
