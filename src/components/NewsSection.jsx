import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";
import bishopFallback from "../assets/portrait_eveque_-_copy_2_-9a431.jpg";

const FALLBACK = [
  { id: 1, published_at: "2026-06-12", category_fr: "DIOCÈSE", category_en: "DIOCESE", category_rw: "DIYOSEZI",
    title_fr: "Assemblée diocésaine pastorale 2026 : Une Église synodale en marche",
    title_en: "Diocesan pastoral assembly 2026: A synodal Church on the move",
    title_rw: "Inteko y'ubutumwa ya diyosezi 2026",
    excerpt_fr: "Le diocèse de Kabgayi a tenu son assemblée pastorale annuelle.",
    excerpt_en: "The Diocese of Kabgayi held its annual pastoral assembly.",
    excerpt_rw: "Diyosezi ya Kabgayi yateranye mu nteko yayo ya pastoral.",
    image_url: "https://images.unsplash.com/photo-1545050073-c2d4693c3c16?w=600&q=80" },
  { id: 2, published_at: "2026-06-12", category_fr: "PASTORALE", category_en: "PASTORAL", category_rw: "PASTORAL",
    title_fr: "Mois de Juin : Mois du Sacré-Cœur de Jésus",
    title_en: "Month of June: Month of the Sacred Heart of Jesus",
    title_rw: "Ukwezi kwa Kamena: Ukwezi kw'Umutima Wera wa Yezu",
    excerpt_fr: "Le mois de juin est consacré au Sacré-Cœur de Jésus.",
    excerpt_en: "The month of June is dedicated to the Sacred Heart of Jesus.",
    excerpt_rw: "Ukwezi kwa Kamena gwerekanywe ku Mutima Wera wa Yezu.",
    image_url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80" },
  { id: 3, published_at: "2026-06-12", category_fr: "ÉGLISE AU RWANDA", category_en: "CHURCH IN RWANDA", category_rw: "ITORERO MU RWANDA",
    title_fr: "Ordinations sacerdotales 2026 à Kabgayi",
    title_en: "Priestly ordinations 2026 in Kabgayi",
    title_rw: "Ubupadiri 2026 i Kabgayi",
    excerpt_fr: "Trois nouveaux prêtres ont été ordonnés au diocèse de Kabgayi.",
    excerpt_en: "Three new priests were ordained in the Diocese of Kabgayi.",
    excerpt_rw: "Abapadiri batatu bashya bahawe ubupadiri muri Diyosezi ya Kabgayi.",
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80" },
];

export default function NewsSection() {
  const { t, lang } = useLang();
  const { data, loading } = useApi("/api/news?limit=3", { data: FALLBACK });
  const { data: settings } = useApi("/api/settings", {});

  const items = (Array.isArray(data) ? data : (data?.data ?? FALLBACK)).slice(0, 3);

  const getField = (item, base) =>
    (lang === "en" ? item[`${base}_en`] : lang === "rw" ? item[`${base}_rw`] : item[`${base}_fr`])
    || item[`${base}_fr`] || "";

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch { return d; }
  };

  const bishopPhoto = settings?.bishop_photo ? resolveImg(settings.bishop_photo) : bishopFallback;
  const bishopName  = settings?.bishop_name || "Mgr Balthazar NTIVUGURUZWA";

  return (
    <section className="news-v2-section">
      <div className="news-v2-inner">
        {/* Section header */}
        <div className="news-v2-header">
          <h2 className="news-v2-title">
            {lang === "fr" ? "Actualités récentes" : lang === "en" ? "Recent news" : "Amakuru mashya"}
          </h2>
          <Link to="/actualites" className="news-v2-see-all">
            {lang === "fr" ? "Voir toutes les actualités" : lang === "en" ? "View all news" : "Reba amakuru yose"} →
          </Link>
        </div>

        <div className="news-v2-grid">
          {/* Left — 3 news cards */}
          <div className="news-v2-cards">
            {loading ? (
              [1,2,3].map((n) => (
                <div key={n} className="news-v2-card skel-card">
                  <div className="skel news-v2-card-img"/>
                  <div style={{padding:12}}><div className="skel skel-line"/><div className="skel skel-line skel-md" style={{marginTop:8}}/></div>
                </div>
              ))
            ) : items.map((item) => (
              <article key={item.id} className="news-v2-card">
                <Link to={`/actualites/${item.id}`} className="news-v2-card-img-wrap">
                  <img
                    src={resolveImg(item.image_url)}
                    alt={getField(item, "title")}
                    className="news-v2-card-img"
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=60"; }}
                  />
                  <span className="news-v2-cat">{getField(item, "category")}</span>
                </Link>
                <div className="news-v2-card-body">
                  <div className="news-v2-card-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {formatDate(item.published_at || item.created_at)}
                  </div>
                  <h3 className="news-v2-card-title">
                    <Link to={`/actualites/${item.id}`}>{getField(item, "title")}</Link>
                  </h3>
                  <Link to={`/actualites/${item.id}`} className="news-v2-read">
                    {lang === "fr" ? "Lire la suite" : lang === "en" ? "Read more" : "Soma ibindi"} →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Right — Bishop message card */}
          <div className="bishop-msg-card">
            <h3 className="bishop-msg-heading">
              {lang === "fr" ? "Message de l'Évêque" : lang === "en" ? "Bishop's Message" : "Ijambo ry'Umusenyeri"}
            </h3>
            <div className="bishop-msg-body">
              <img
                src={bishopPhoto}
                alt={bishopName}
                className="bishop-msg-photo"
                onError={(e) => { e.target.src = bishopFallback; }}
              />
              <blockquote className="bishop-msg-quote">
                {lang === "fr"
                  ? "« Soyons des témoins joyeux de l'Évangile, au service de l'amour et de la vérité. »"
                  : lang === "en"
                  ? "« Let us be joyful witnesses of the Gospel, in the service of love and truth. »"
                  : "« Tube inzira z'inkuru nziza z'Ubutumwa Bwiza, mu gusukura urukundo n'ukuri. »"}
              </blockquote>
            </div>
            <Link to="/a-propos" className="bishop-msg-btn">
              {lang === "fr" ? "Lire le message complet" : lang === "en" ? "Read full message" : "Soma ubutumwa bwose"}
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
