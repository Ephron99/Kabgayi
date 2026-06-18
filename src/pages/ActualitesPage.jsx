import { useLang } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";

export default function ActualitesPage() {
  const { t, lang } = useLang();
  const { data, loading, error } = useApi("/api/news?limit=50", { data: [] });
  const news = Array.isArray(data) ? data : (data?.data ?? []);

  const getField = (item, base) =>
    (lang === "en" ? item[`${base}_en`] : lang === "rw" ? item[`${base}_rw`] : item[`${base}_fr`])
    || item[`${base}_fr`] || "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      });
    } catch { return dateStr; }
  };

  return (
    <main id="main-content">
      <div className="page-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80)" }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{t("nav_actualites")}</div>
          <h1>{t("page_actualites")}</h1>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">{t("nav_home")}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{t("nav_actualites")}</span>
      </nav>

      <div className="page-content">
        {loading && (
          <div className="news-page-grid">
            {[1,2,3,4,5,6].map((n) => (
              <div key={n} className="news-skeleton" aria-hidden="true">
                <div className="skel skel-img" style={{ height: 200 }} />
                <div className="skel-body">
                  <div className="skel skel-line skel-sm" />
                  <div className="skel skel-line" />
                  <div className="skel skel-line skel-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="api-error" role="alert">
            <span>⚠️</span>
            {lang === "fr" ? "Impossible de charger les actualités." :
             lang === "en" ? "Could not load news." :
             "Ntibishoboka gufungura amakuru."}
          </div>
        )}

        {!loading && news.length === 0 && !error && (
          <div className="empty-news">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
            <p>{lang === "fr" ? "Aucun article publié pour le moment." :
               lang === "en" ? "No articles published yet." :
               "Nta makuru ashyizwe ahagaragara ubu."}</p>
          </div>
        )}

        {!loading && news.length > 0 && (
          <div className="news-page-grid">
            {news.map((item) => (
              <article key={item.id} className="news-card news-card--large">
                <Link to={`/actualites/${item.id}`} className="news-card-img-wrap">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80"}
                    alt={getField(item, "title")}
                    className="news-card-img"
                    loading="lazy"
                  />
                  <span className="news-card-cat">{getField(item, "category")}</span>
                </Link>
                <div className="news-card-body">
                  <time className="news-card-date">
                    {formatDate(item.published_at || item.created_at)}
                  </time>
                  <h3 className="news-card-title">
                    <Link to={`/actualites/${item.id}`}>{getField(item, "title")}</Link>
                  </h3>
                  <p className="news-card-excerpt">{getField(item, "excerpt")}</p>
                  <Link to={`/actualites/${item.id}`} className="news-card-read">
                    {t("news_read")} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
