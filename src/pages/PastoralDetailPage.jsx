import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { BACKEND_BASE } from "../config";

export default function PastoralDetailPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const { data: item, loading, error } = useApi(`/pastoral/slug/${slug}`);

  if (loading) return <div className="page-content"><p>Loading...</p></div>;
  if (error || !item) return <div className="page-content"><p>Page not found</p></div>;

  const getName = () => item[`name_${lang}`] || item.name_fr;
  const getMoto = () => item[`moto_${lang}`] || item.moto_fr;
  const getSaintPatron = () => item[`saint_patron_${lang}`] || item.saint_patron_fr;
  const getDirecteurName = () => item[`directeur_name_${lang}`] || item.directeur_name_fr;
  const getImageUrl = () => item.image_url ? (item.image_url.startsWith("http") ? item.image_url : `${BACKEND_BASE}${item.image_url}`) : null;

  return (
    <main id="main-content">
      <div className="page-hero" style={{ backgroundImage: getImageUrl() ? `url(${getImageUrl()})` : undefined, backgroundColor: !getImageUrl() ? 'var(--navy)' : undefined }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">Pastoral</div>
          <h1>{getName()}</h1>
        </div>
      </div>
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">{lang === "fr" ? "Accueil" : lang === "en" ? "Home" : "Ahabanza"}</Link>
        <span aria-hidden="true"> / </span>
        <Link to="/pastorale">{lang === "fr" ? "Pastorale" : lang === "en" ? "Pastoral" : "Pastoral"}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{getName()}</span>
      </nav>
      <div className="page-content">
        <div className="detail-layout">
          {getImageUrl() && <img src={getImageUrl()} alt={getName()} className="detail-img" loading="lazy" />}
          <div className="detail-text">
            <h2>{getName()}</h2>
            <div className="section-divider" aria-hidden="true"></div>
            
            {getMoto() && (
              <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "var(--cream)", borderRadius: "var(--radius)", borderLeft: "4px solid var(--gold)" }}>
                <p style={{ fontStyle: "italic", margin: 0, fontSize: "18px" }}>
                  "{getMoto()}"
                </p>
              </div>
            )}
            
            {getSaintPatron() && (
              <div style={{ marginBottom: "20px" }}>
                <strong>{lang === "fr" ? "Saint Patron : " : lang === "en" ? "Patron Saint : " : "Mutabera wa Gatolika : "}</strong>
                {getSaintPatron()}
              </div>
            )}
            
            {item.date_fondation && (
              <div style={{ marginBottom: "20px" }}>
                <strong>{lang === "fr" ? "Date de fondation : " : lang === "en" ? "Foundation date : " : "Itariki ry'ibere : "}</strong>
                {new Date(item.date_fondation).toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "rw-RW")}
              </div>
            )}
            
            {getDirecteurName() && (
              <div style={{ marginBottom: "20px" }}>
                <strong>{lang === "fr" ? "Nom du Directeur : " : lang === "en" ? "Director's name : " : "Izina rya Muyobozi : "}</strong>
                {getDirecteurName()}
              </div>
            )}
            
            {item.directeur_contact && (
              <div style={{ marginBottom: "20px" }}>
                <strong>{lang === "fr" ? "Contact du Directeur : " : lang === "en" ? "Director's contact : " : "Imibare yo kwandikira Muyobozi : "}</strong>
                {item.directeur_contact}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
