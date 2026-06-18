import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAdminLang } from "../context/AdminLangContext";

export default function Dashboard() {
  const { t } = useAdminLang();
  const [stats, setStats]     = useState({ slides: 0, news: 0, parishes: 0, messages: 0 });
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
    { icon: "🖼️", label: t("hero_slides"), value: stats.slides,   to: "/admin/hero",     color: "#8B0000" },
    { icon: "📰", label: t("news"),        value: stats.news,     to: "/admin/news",     color: "#2563EB" },
    { icon: "⛪", label: t("parishes"),    value: stats.parishes, to: "/admin/parishes", color: "#059669" },
    { icon: "✉️", label: t("unread"),      value: stats.messages, to: "/admin/messages", color: "#D97706" },
  ];

  if (loading) return (
    <div className="admin-loading" style={{ height: 400 }}>
      <div className="admin-spinner" />
    </div>
  );

  return (
    <div>
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
        <div className="card">
          <div className="card-title">📰 {t("recent_news")}</div>
          {recentNews.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><p>{t("no_articles")}</p></div>
          ) : (
            <table>
              <thead><tr><th>{t("title_col")}</th><th>{t("status")}</th><th>{t("date")}</th></tr></thead>
              <tbody>
                {recentNews.map((n) => (
                  <tr key={n.id}>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <Link to={`/admin/news/${n.id}`} style={{ color: "var(--red)", fontWeight: 500 }}>{n.title_fr}</Link>
                    </td>
                    <td>
                      <span className={`badge ${n.is_published ? "badge-green" : "badge-yellow"}`}>
                        {n.is_published ? t("published") : t("draft")}
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
          <div style={{ marginTop: 16 }}><Link to="/admin/news" className="btn btn-secondary btn-sm">{t("view_all")}</Link></div>
        </div>

        <div className="card">
          <div className="card-title">✉️ {t("recent_msgs")}</div>
          {recentMsgs.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><p>{t("no_messages")}</p></div>
          ) : (
            <table>
              <thead><tr><th>{t("from")}</th><th>{t("subject")}</th><th>{t("status")}</th></tr></thead>
              <tbody>
                {recentMsgs.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: m.is_read ? 400 : 700 }}>{m.name}</td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                      {m.subject || t("no_subject")}
                    </td>
                    <td>
                      <span className={`badge ${m.is_read ? "badge-gray" : "badge-blue"}`}>
                        {m.is_read ? t("read") : t("new_msg")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 16 }}><Link to="/admin/messages" className="btn btn-secondary btn-sm">{t("view_all")}</Link></div>
        </div>
      </div>
    </div>
  );
}
