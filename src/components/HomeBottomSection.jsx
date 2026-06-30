import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";

// ── Parishes + Documents + Twitter row ─────────────────────
function ParishesWidget({ lang }) {
  const { data: parishes } = useApi("/api/parishes", []);
  const list = (Array.isArray(parishes) ? parishes : []).slice(0, 1);

  return (
    <div className="home-widget">
      <div className="home-widget-header">
        <span className="home-widget-icon"></span>
        <h3>{lang === "fr" ? "NOS PAROISSES" : lang === "en" ? "OUR PARISHES" : "PARUWASI ZACU"}</h3>
        <Link to="/paroisses" className="home-widget-link">
          {lang === "fr" ? "Voir toutes les paroisses" : lang === "en" ? "View all" : "Reba zose"} →
        </Link>
      </div>
      <div className="home-parish-map">
        <svg viewBox="0 0 240 180" width="100%" style={{ display:"block" }}>
          <rect width="240" height="180" fill="#EEF2FF" rx="8"/>
          <text x="120" y="75" textAnchor="middle" fill="#4B5563" fontSize="13" fontWeight="600">Rwanda</text>
          <text x="120" y="95" textAnchor="middle" fill="#8B0000" fontSize="11">Diocèse de Kabgayi</text>
          {[[100,80],[115,95],[130,88],[108,110],[125,105]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#8B0000" opacity="0.7"/>
              <circle cx={x} cy={y} r="3" fill="#D4AF37"/>
            </g>
          ))}
        </svg>
      </div>
      <div className="home-parish-search">
        <label className="home-parish-search-label">
          {lang === "fr" ? "Trouvez votre paroisse" : lang === "en" ? "Find your parish" : "Shaka paruwasi yawe"}
        </label>
        <div className="home-parish-search-row">
          <select className="home-parish-select">
            <option>{lang === "fr" ? "Sélectionner une paroisse" : lang === "en" ? "Select a parish" : "Hitamo paruwasi"}</option>
            {(Array.isArray(parishes) ? parishes : []).map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
          <button className="home-parish-search-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            {lang === "fr" ? "Rechercher" : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentsWidget({ lang }) {
  const docs = [
    { id:1, title: "Message de Pâques", type:"PDF", icon:"📄" },
    { id:2, title: "Bulletin diocésain",  type:"PDF", icon:"📄" },
  ];
  return (
    <div className="home-widget">
      <div className="home-widget-header">
        <span className="home-widget-icon">📁</span>
        <h3>{lang === "fr" ? "DOCUMENTS OFFICIELS" : lang === "en" ? "OFFICIAL DOCUMENTS" : "INYANDIKO ZIHARIYE"}</h3>
      </div>
      <div className="home-docs-list">
        {docs.map((d) => (
          <div key={d.id} className="home-doc-item">
            <div className="home-doc-icon">📕</div>
            <span className="home-doc-title">{d.title}</span>
          </div>
        ))}
      </div>
      <Link to="/documentation" className="home-widget-footer-link">
        {lang === "fr" ? "Voir tous les documents" : lang === "en" ? "View all documents" : "Reba inyandiko zose"} →
      </Link>
    </div>
  );
}

function TwitterWidget({ lang }) {
  const tweets = [
    { date: "11 Juin 2026", text: lang === "fr" ? "Journée mondiale du Pauvre : « L'espérance des pauvres ne sera jamais déçue. »" : "World Day of the Poor: 'The hope of the poor will never be deceived.'", link: "#" },
    { date: "10 Juin 2026", text: lang === "fr" ? "Pèlerinage diocésain 2026 à Notre-Dame de Kibeho. Tous invités !" : "Diocesan pilgrimage 2026 to Our Lady of Kibeho. All welcome!", link: "#" },
    { date: "09 Juin 2026", text: lang === "fr" ? "Formation des catéchistes : Un engagement pour l'avenir de notre Église." : "Formation of catechists: A commitment for the future of our Church.", link: "#" },
  ];
  return (
    <div className="home-widget">
      <div className="home-widget-header">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{color:"#1DA1F2"}}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <h3>@TWITTER DIOCESE OF KABGAYI</h3>
      </div>
      <div className="home-tweets-list">
        {tweets.map((tw, i) => (
          <div key={i} className="home-tweet">
            <div className="home-tweet-date">{tw.date}</div>
            <p className="home-tweet-text">{tw.text}</p>
            <a href={tw.link} className="home-tweet-link">Voir sur Twitter →</a>
          </div>
        ))}
      </div>
      <a href="https://twitter.com/diocesekabgayi" target="_blank" rel="noopener noreferrer" className="home-widget-footer-link">
        Suivre @DioceseKabgayi →
      </a>
    </div>
  );
}

// ── Action banners row ──────────────────────────────────────
function ActionBanners({ lang }) {
  const banners = [
    {
      icon: "",
      title: lang === "fr" ? "Nos Projets" : lang === "en" ? "Our Projects" : "Imishinga Yacu",
      desc:  lang === "fr" ? "Découvrez nos projets pastoraux et d'évangélisation." : "Discover our pastoral and evangelization projects.",
      to:    "/pastorale/priorites",
      color: "#1A3C6E",
    },
    {
      icon: "",
      title: lang === "fr" ? "FAIRE UN DON" : lang === "en" ? "MAKE A DONATION" : "TANGA IMPANO",
      desc:  lang === "fr" ? "Soutenez les œuvres du Diocèse. Votre générosité change des vies." : "Support the Diocese's works. Your generosity changes lives.",
      to:    "/contact",
      color: "#8B0000",
      highlighted: true,
    },
    {
      icon: "",
      title: lang === "fr" ? "NOS PRIORITÉS PASTORALES" : lang === "en" ? "OUR PASTORAL PRIORITIES" : "IBINTU BY'INGENZI",
      desc:  "",
      to:    "/pastorale/priorites",
      color: "#1A3C6E",
    },
  ];
  return (
    <div className="home-banners">
      {banners.map((b, i) => (
        <Link key={i} to={b.to} className={`home-banner${b.highlighted ? " highlight" : ""}`} style={{ background: b.color }}>
          <div className="home-banner-icon">{b.icon}</div>
          <div className="home-banner-text">
            <strong>{b.title}</strong>
            {b.desc && <p>{b.desc}</p>}
          </div>
          <div className="home-banner-arrow">›</div>
        </Link>
      ))}
    </div>
  );
}

// ── News ticker ─────────────────────────────────────────────
function NewsTicker({ lang }) {
  const items = [
    lang === "fr" ? "Bienvenue sur le site officiel du Diocèse de Kabgayi" : "Welcome to the official website of the Diocese of Kabgayi",
    lang === "fr" ? "Ordinations sacerdotales 2026" : "Priestly ordinations 2026",
    lang === "fr" ? "Jubilé 2025 : Pèlerins d'Espérance" : "Jubilee 2025: Pilgrims of Hope",
  ];
  return (
    <div className="news-ticker">
      <div className="news-ticker-label">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
        {lang === "fr" ? "COMMUNIQUÉS" : "NEWS"}
      </div>
      <div className="news-ticker-track">
        <div className="news-ticker-content">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="news-ticker-item">• {item}</span>
          ))}
        </div>
      </div>
      <button className="news-ticker-pause" aria-label="Pause">⏸</button>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────
export default function HomeBottomSection() {
  const { lang } = useLang();
  return (
    <>
      {/* Widgets row */}
      <section className="home-widgets-section">
        <div className="home-widgets-inner">
          <ParishesWidget lang={lang} />
          <DocumentsWidget lang={lang} />
          <TwitterWidget lang={lang} />
        </div>
      </section>

      {/* Action banners */}
      <section className="home-banners-section">
        <div className="home-banners-inner">
          <ActionBanners lang={lang} />
        </div>
      </section>

      {/* Ticker */}
      <NewsTicker lang={lang} />
    </>
  );
}
