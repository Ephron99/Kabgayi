import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const { data: service, loading, error } = useApi(`/api/services/slug/${slug}`, null);

  if (loading) {
    return (
      <main id="main-content">
        <div className="page-content">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main id="main-content">
        <div className="page-content">
          <p>Service not found.</p>
        </div>
      </main>
    );
  }

  const getName = () => service[`name_${lang}`] || service.name_fr;
  const getDesc = () => service[`desc_${lang}`] || service.desc_fr;

  return (
    <main id="main-content">
      <div className="page-hero"
        style={{ 
          backgroundImage: `url(${resolveImg(service.image_url) || "https://images.unsplash.com/photo-1548625149-720754952028?w=1600&q=80"})` 
        }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{service.section}</div>
          <h1>{getName()}</h1>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">
          {lang === "fr" ? "Accueil" : lang === "en" ? "Home" : "Ahabanza"}
        </Link>
        <span aria-hidden="true"> / </span>
        <Link to="/services">
          {lang === "fr" ? "Services Diocésains" : lang === "en" ? "Diocesan Services" : "Serivisi"}
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{getName()}</span>
      </nav>

      <div className="page-content">
        <div className="detail-layout">
          {service.image_url && (
            <img
              src={resolveImg(service.image_url)}
              alt={getName()}
              className="detail-img"
              loading="lazy"
            />
          )}
          <div className="detail-text">
            <h2>{getName()}</h2>
            <div className="section-divider" aria-hidden="true"></div>
            {getDesc() && <p>{getDesc()}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
