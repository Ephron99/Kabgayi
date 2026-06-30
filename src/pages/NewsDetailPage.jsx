import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";

export default function NewsDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { data: item, loading, error } = useApi(`/api/news/${id}`, null);

  const getField = (base) => {
    if (!item) return "";
    return (lang === "en" ? item[`${base}_en`] : lang === "rw" ? item[`${base}_rw`] : item[`${base}_fr`])
      || item[`${base}_fr`] || "";
  };

  const formatDate = (d) => {
    if (!d) return "";
    try { return new Date(d).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" }); }
    catch { return d; }
  };

  return (
    <main id="main-content">
      <div className="page-hero" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80)", minHeight: 220 }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="section-label">{t("nav_actualites")}</div>
        </div>
      </div>

      <nav className="breadcrumb">
        <Link to="/">{t("nav_home")}</Link>
        <span> / </span>
        <Link to="/actualites">{t("nav_actualites")}</Link>
        <span> / </span>
        <span aria-current="page">{loading ? "…" : getField("title").substring(0, 40) + "…"}</span>
      </nav>

      <div className="page-content">
        {loading && (
          <div className="news-detail">
            <div className="skel skel-line skel-sm" style={{ height: 22, marginBottom: 16 }} />
            <div className="skel skel-line" style={{ height: 40, marginBottom: 24 }} />
            <div className="skel skel-img" style={{ height: 400, borderRadius: 12, marginBottom: 28 }} />
            {[1,2,3].map((n) => <div key={n} className="skel skel-line" style={{ marginBottom: 12 }} />)}
          </div>
        )}

        {error && (
          <div className="api-error" role="alert">
            ⚠️ {lang === "fr" ? "Impossible de charger cet article." : lang === "en" ? "Could not load this article." : "Ntibishoboka gufungura iyi nkuru."}
          </div>
        )}

        {!loading && item && (
          <div className="news-detail">
            <Link to="/actualites" className="news-back">
              ← {lang === "fr" ? "Retour aux actualités" : lang === "en" ? "Back to news" : "Subira ku makuru"}
            </Link>

            <div className="news-detail-header">
              {getField("category") && (
                <span className="news-detail-cat">{getField("category")}</span>
              )}
              <h1 className="news-detail-title">{getField("title")}</h1>
              <div className="news-detail-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ display:"inline", marginRight:4 }}>
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDate(item.published_at || item.created_at)}
                </span>
                {item.author_name && <span>✍️ {item.author_name}</span>}
              </div>
            </div>

            {item.image_url && (
              <img
                src={resolveImg(item.image_url)}
                alt={getField("title")}
                className="news-detail-img"
                loading="eager"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}

            <div className="news-detail-body">
              {/* Full content if available, else excerpt */}
              {(getField("content") || getField("excerpt")).split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
              <Link to="/actualites" className="btn btn--outline-dark">
                ← {lang === "fr" ? "Autres actualités" : lang === "en" ? "Other news" : "Amakuru yandi"}
              </Link>
              <Link to="/contact" className="btn btn--primary">
                {lang === "fr" ? "Nous contacter" : lang === "en" ? "Contact us" : "Twandikire"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
