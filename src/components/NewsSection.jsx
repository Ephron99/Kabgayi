import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";
import eveque from '../assets/portrait_eveque_-_copy_2_-9a431.jpg'; 

const FALLBACK_PHOTO = eveque;
// Static fallback shown while loading or if backend is down
const FALLBACK = [
  { id: 1, published_at: "2024-05-12", category_fr: "ORDINATION", category_en: "ORDINATION", category_rw: "UBUPADIRI",
    title_fr: "Ordination sacerdotale de trois nouveaux prêtres",
    title_en: "Priestly ordination of three new priests",
    title_rw: "Ubupadiri bw'abapadiri batatu bashya",
    excerpt_fr: "Le diocèse de Kabgayi a la joie d'annoncer l'ordination sacerdotale de trois diacres.",
    excerpt_en: "The Diocese of Kabgayi is pleased to announce the priestly ordination of three deacons.",
    excerpt_rw: "Diyosezi ya Kabgayi yishimira gutangaza ubupadiri bw'abadiyakoni batatu.",
    image_url: FALLBACK_PHOTO },
  { id: 2, published_at: "2024-05-08", category_fr: "PÈLERINAGE", category_en: "PILGRIMAGE", category_rw: "URUGENDO",
    title_fr: "Pèlerinage diocésain à Notre Dame de Kibeho",
    title_en: "Diocesan pilgrimage to Our Lady of Kibeho",
    title_rw: "Urugendo rwa Diyosezi kuri Notre Dame wa Kibeho",
    excerpt_fr: "Plus de 5 000 fidèles ont participé au pèlerinage annuel du diocèse.",
    excerpt_en: "More than 5,000 faithful participated in the diocese's annual pilgrimage.",
    excerpt_rw: "Abakristu barengeje 5.000 bashoboye gufata urugendo rw'umwaka wa diyosezi.",
    image_url: FALLBACK_PHOTO },
  { id: 3, published_at: "2024-05-03", category_fr: "CARÊME", category_en: "LENT", category_rw: "KAREME",
    title_fr: "Carême de partage : merci pour votre générosité",
    title_en: "Sharing Lent: thank you for your generosity",
    title_rw: "Kareme yo kugabana: urakoze ubukerebutsi bwawe",
    excerpt_fr: "Grâce à votre soutien, plusieurs projets sociaux ont été réalisés.",
    excerpt_en: "Thanks to your support, several social projects have been completed.",
    excerpt_rw: "Binyuze ku bufasha bwawe, imishinga myinshi y'imibereho yashyizwe mu bikorwa.",
    image_url: FALLBACK_PHOTO },
  { id: 4, published_at: "2024-04-28", category_fr: "PÂQUES", category_en: "EASTER", category_rw: "PASIKA",
    title_fr: "Message de Pâques de Mgr Balthazar Ntivuguruzwa",
    title_en: "Easter message from Mgr Balthazar Ntivuguruzwa",
    title_rw: "Ubutumwa bwa Pasika bwa Mgr Balthazar Ntivuguruzwa",
    excerpt_fr: "Le Christ est ressuscité ! Alléluia, Alléluia !",
    excerpt_en: "Christ is risen! Alleluia, Alleluia!",
    excerpt_rw: "Kristu yazutse! Haleluya, Haleluya!",
    image_url: FALLBACK_PHOTO },
];

export default function NewsSection() {
  const { t, lang } = useLang();
  const { data, loading } = useApi("/api/news?limit=4", { data: FALLBACK });

  // API returns { data: [...], total } or direct array
  const items = Array.isArray(data) ? data : (data?.data ?? FALLBACK);
  const displayed = items.slice(0, 4);

  const getField = (item, base) =>
    (lang === "en" ? item[`${base}_en`] : lang === "rw" ? item[`${base}_rw`] : item[`${base}_fr`])
    || item[`${base}_fr`] || "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString(
        lang === "en" ? "en-GB" : lang === "rw" ? "fr-FR" : "fr-FR",
        { day: "numeric", month: "long", year: "numeric" }
      );
    } catch { return dateStr; }
  };

  return (
    <section className="news-section" aria-labelledby="news-heading">
      <div className="section-inner">
        <div className="news-header">
          <div>
            <div className="section-label">{t("news_title")}</div>
            <h2 id="news-heading" className="section-title">
              {lang === "fr" ? "Dernières Actualités" : lang === "en" ? "Latest News" : "Amakuru Mashya"}
            </h2>
            <div className="section-divider" aria-hidden="true"></div>
          </div>
          <Link to="/actualites" className="link-all">{t("news_all")} →</Link>
        </div>

        {loading && displayed.length === 0 ? (
          <div className="news-skeleton-grid">
            {[1,2,3,4].map((n) => (
              <div key={n} className="news-skeleton" aria-hidden="true">
                <div className="skel skel-img" />
                <div className="skel-body">
                  <div className="skel skel-line skel-sm" />
                  <div className="skel skel-line" />
                  <div className="skel skel-line skel-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="news-grid">
            {displayed.map((item) => (
              <article key={item.id} className="news-card">
                <Link to={`/actualites/${item.id}`} className="news-card-img-wrap"
                  aria-label={getField(item, "title")}>
                  <img
                    
                      src={item.image_url === FALLBACK_PHOTO ? item.image_url : resolveImg(item.image_url)}
                      alt={getField(item, "title")}
                      className="news-card-img"
                      loading="lazy"
                    
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
    </section>
  );
}
