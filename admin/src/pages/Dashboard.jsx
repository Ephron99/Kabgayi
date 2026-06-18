import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ slides: 0, news: 0, parishes: 0, messages: 0 });
  const [recentNews, setRecentNews] = useState([]);
  const [recentMsgs, setRecentMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getHeroSlides().catch(() => []),
      api.getAllNews().catch(() => []),
      api.getAllParishes().catch(() => []),
      api.getMessages().catch(() => []),
    ]).then(([slides, news, parishes, msgs]) => {
      setStats({
        slides:   slides.length,
        news:     news.length,
        parishes: parishes.length,
        messages: msgs.filter((m) => !m.is_read).length,
      });
      setRecentNews(news.slice(0, 5));
      setRecentMsgs(msgs.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: "🖼️", label: "Slides Hero",   value: stats.slides,   to: "/hero",     color: "#8B0000" },
    { icon: "📰", label: "Actualités",    value: stats.news,     to: "/news",     color: "#2563EB" },
    { icon: "⛪", label: "Paroisses",     value: stats.parishes, to: "/parishes", color: "#059669" },
    { icon: "✉️", label: "Non lus",       value: stats.messages, to: "/messages", color: "#D97706" },
  ];

  if (loading) return (
    <div className="admin-loading" style={{ height: 400 }}>
      <div className="admin-spinner" />
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {statCards.map((s) => (
          <Link to={s.to} key={s.label} className="stat-card" style={{ borderLeftColor: s.color, textDecoration: "none" }}>
            <div className="stat-icon" style={{ background: `${s.color}15`, fontSize: 26 }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent news */}
        <div className="card">
          <div className="card-title">📰 Dernières actualités</div>
          {recentNews.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><p>Aucun article</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.map((n) => (
                  <tr key={n.id}>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <Link to={`/news/${n.id}`} style={{ color: "var(--red)", fontWeight: 500 }}>
                        {n.title_fr}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${n.is_published ? "badge-green" : "badge-yellow"}`}>
                        {n.is_published ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-dim)", fontSize: 12, whiteSpace: "nowrap" }}>
                      {new Date(n.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 16 }}>
            <Link to="/news" className="btn btn-secondary btn-sm">Voir tout →</Link>
          </div>
        </div>

        {/* Recent messages */}
        <div className="card">
          <div className="card-title">✉️ Messages récents</div>
          {recentMsgs.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><p>Aucun message</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>De</th>
                  <th>Sujet</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentMsgs.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: m.is_read ? 400 : 700 }}>{m.name}</td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                      {m.subject || "(sans sujet)"}
                    </td>
                    <td>
                      <span className={`badge ${m.is_read ? "badge-gray" : "badge-blue"}`}>
                        {m.is_read ? "Lu" : "Nouveau"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 16 }}>
            <Link to="/messages" className="btn btn-secondary btn-sm">Voir tout →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
