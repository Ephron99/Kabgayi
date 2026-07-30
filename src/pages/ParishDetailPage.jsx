import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";

export default function ParishDetailPage() {
  const { id } = useParams();
  const { lang } = useLang();
  const { data: parish, loading, error } = useApi(`/api/parishes/${id}`, null);

  if (loading) {
    return (
      <main id="main-content">
        <div className="page-content">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !parish) {
    return (
      <main id="main-content">
        <div className="page-content">
          <p>Parish not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <div className="page-hero"
        style={{ 
          backgroundImage: `url(${resolveImg(parish.image_url) || "https://images.unsplash.com/photo-1548625149-720754952028?w=1600&q=80"})` 
        }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">
            {lang === "fr" ? "Paroisse" : lang === "en" ? "Parish" : "Paruwasi"}
          </div>
          <h1>{parish.name}</h1>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">
          {lang === "fr" ? "Accueil" : lang === "en" ? "Home" : "Ahabanza"}
        </Link>
        <span aria-hidden="true"> / </span>
        <Link to="/paroisses">
          {lang === "fr" ? "Paroisses" : lang === "en" ? "Parishes" : "Paruwasi"}
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{parish.name}</span>
      </nav>

      <div className="page-content">
        <div className="detail-layout">
          {parish.image_url && (
            <img
              src={resolveImg(parish.image_url)}
              alt={parish.name}
              className="detail-img"
              loading="lazy"
            />
          )}
          <div className="detail-text">
            <h2>{parish.name}</h2>
            <div className="section-divider" aria-hidden="true"></div>

            {parish.location && (
              <div style={{ marginBottom: "16px" }}>
                <strong>
                  {lang === "fr" ? "Localisation : " : lang === "en" ? "Location : " : "Aho hagera : "}
                </strong>
                {parish.location}
              </div>
            )}

            {parish.vicar && (
              <div style={{ marginBottom: "16px" }}>
                <strong>
                  {lang === "fr" ? "Curé : " : lang === "en" ? "Vicar : " : "Umupadiri : "}
                </strong>
                {parish.vicar}
              </div>
            )}

            {parish.phone && (
              <div style={{ marginBottom: "16px" }}>
                <strong>
                  {lang === "fr" ? "Téléphone : " : lang === "en" ? "Phone : " : "Telefone : "}
                </strong>
                {parish.phone}
              </div>
            )}

            {parish.email && (
              <div style={{ marginBottom: "16px" }}>
                <strong>
                  {lang === "fr" ? "Email : " : "Email : "}
                </strong>
                {parish.email}
              </div>
            )}

            {parish.description && (
              <div style={{ marginTop: "24px" }}>
                <p>{parish.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
