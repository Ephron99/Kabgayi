import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";

const BACKEND = "http://localhost:5000";
const resolveImg = (url) => (!url ? "" : url.startsWith("http") ? url : `${BACKEND}${url}`);

const FALLBACK = [
  { id: 1, name: "Paroisse Cathédrale de Kabgayi",  location: "Kabgayi",    image_url: "https://images.unsplash.com/photo-1548625149-720754952028?w=400&q=80" },
  { id: 2, name: "Paroisse Sainte Anne de Gitarama", location: "Gitarama",   image_url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&q=80" },
  { id: 3, name: "Paroisse Sancta Maria Byimana",    location: "Byimana",    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80" },
  { id: 4, name: "Paroisse Nyarusange",              location: "Nyarusange", image_url: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=400&q=80" },
];

export default function ParishesSection() {
  const { t } = useLang();
  const { data } = useApi("/api/parishes", FALLBACK);
  const list     = (Array.isArray(data) && data.length > 0) ? data : FALLBACK;
  const displayed = list.slice(0, 4);

  return (
    <section className="parishes-section" aria-labelledby="parishes-heading">
      <div className="section-inner parishes-layout">
        <div className="parishes-list">
          <div className="section-label">{t("parishes_title")}</div>
          <h2 id="parishes-heading" className="section-title section-title--white">{t("parishes_title")}</h2>
          <div className="section-divider section-divider--gold" aria-hidden="true"></div>

          <ul className="parish-list" role="list">
            {displayed.map((p) => (
              <li key={p.id}>
                <Link to={`/paroisses/${p.id}`} className="parish-list-item">
                  <img
                    src={resolveImg(p.image_url) || "https://images.unsplash.com/photo-1548625149-720754952028?w=400&q=80"}
                    alt={p.name}
                    className="parish-list-img"
                    loading="lazy"
                  />
                  <div className="parish-list-info">
                    <strong className="parish-list-name">{p.name}</strong>
                    <span className="parish-list-loc">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {p.location}
                    </span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="parish-list-arrow" aria-hidden="true">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/paroisses" className="btn btn--gold">{t("parishes_all")}</Link>
        </div>

        <div className="parishes-map" aria-label="Carte des paroisses">
          <div className="map-placeholder">
            <svg viewBox="0 0 400 300" width="100%" aria-hidden="true">
              <rect width="400" height="300" fill="#1a0a0a" rx="12"/>
              <text x="200" y="140" textAnchor="middle" fill="#D4AF37" fontSize="18" fontFamily="serif">Rwanda</text>
              <text x="200" y="165" textAnchor="middle" fill="#fff" fontSize="12" opacity="0.6">Diocèse de Kabgayi</text>
              {[[200,130],[170,155],[220,165],[185,175]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="8" fill="#8B0000" opacity="0.8"/>
                  <circle cx={x} cy={y} r="4" fill="#D4AF37"/>
                </g>
              ))}
            </svg>
            <div className="map-overlay-text">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{list.length > 0 ? `${list.length} Paroisses` : "47 Paroisses"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
