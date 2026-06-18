import { useLang } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";

export default function ParoissesPage() {
  const { t, lang } = useLang();
  const { data: parishes, loading, error } = useApi("/api/parishes", []);
  const list = Array.isArray(parishes) ? parishes : [];

  return (
    <main id="main-content">
      <div className="page-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1548625149-720754952028?w=1600&q=80)" }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{t("nav_paroisses")}</div>
          <h1>{t("page_paroisses")}</h1>
          <p>
            {list.length > 0
              ? `${list.length} ${lang === "fr" ? "paroisses au service du peuple de Dieu"
                  : lang === "en" ? "parishes serving the people of God"
                  : "paruwasi zisukura abantu b'Imana"}`
              : lang === "fr" ? "47 paroisses au service du peuple de Dieu"
              : lang === "en" ? "47 parishes serving the people of God"
              : "Paruwasi 47 zisukura abantu b'Imana"}
          </p>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">{t("nav_home")}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{t("nav_paroisses")}</span>
      </nav>

      <div className="page-content">
        {loading && (
          <div className="parishes-grid">
            {[1,2,3,4,5,6].map((n) => (
              <div key={n} className="parish-card" aria-hidden="true">
                <div className="skel" style={{ height: 200, borderRadius: "8px 8px 0 0" }} />
                <div className="skel-body" style={{ padding: 16 }}>
                  <div className="skel skel-line" />
                  <div className="skel skel-line skel-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="api-error" role="alert">
            <span>⚠️</span>
            {lang === "fr" ? "Impossible de charger les paroisses." :
             lang === "en" ? "Could not load parishes." :
             "Ntibishoboka gufungura paruwasi."}
          </div>
        )}

        {!loading && list.length > 0 && (
          <div className="parishes-grid">
            {list.map((p) => (
              <article key={p.id} className="parish-card">
                <div className="parish-card-img-wrap">
                  <img
                    src={p.image_url || "https://images.unsplash.com/photo-1548625149-720754952028?w=400&q=80"}
                    alt={p.name}
                    className="parish-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="parish-card-body">
                  <h3 className="parish-card-name">{p.name}</h3>
                  {p.location && (
                    <p className="parish-card-loc">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {p.location}
                    </p>
                  )}
                  {p.vicar && (
                    <p className="parish-card-vicar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {p.vicar}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && list.length === 0 && !error && (
          <div className="empty-news">
            <div style={{ fontSize: 48, marginBottom: 16 }}>⛪</div>
            <p>{lang === "fr" ? "Aucune paroisse enregistrée pour le moment." :
               lang === "en" ? "No parishes registered yet." :
               "Nta paruwasi zanditswe ubu."}</p>
          </div>
        )}

        <div className="parishes-note">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>
            {lang === "fr" ? "Le Diocèse compte 47 paroisses au total. Contenu géré via le portail administratif."
            : lang === "en" ? "The Diocese has 47 parishes in total. Content managed via the admin portal."
            : "Diyosezi igira paruwasi 47 muri rusange. Ibikubiyemo birindwa binyuze mu portail ya admin."}
          </span>
        </div>
      </div>
    </main>
  );
}
