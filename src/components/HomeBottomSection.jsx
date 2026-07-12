import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import {
  MapPin, Search, FileText,
  ClipboardList, Heart, Target,
  ChevronRight, FolderOpen, Church, CalendarDays,
} from "lucide-react";

// ── Parishes widget ─────────────────────────────────────────
function ParishesWidget({ lang }) {
  const { data: parishes } = useApi("/api/parishes", []);
  const list = Array.isArray(parishes) ? parishes : [];

  return (
    <div className="home-widget">
      <div className="home-widget-header">
        <Church size={15} strokeWidth={2} style={{ color:"var(--red)", flexShrink:0 }} />
        <h3>{lang === "fr" ? "NOS PAROISSES" : lang === "en" ? "OUR PARISHES" : "PARUWASI ZACU"}</h3>
        <Link to="/paroisses" className="home-widget-link">
          {lang === "fr" ? "Voir toutes →" : lang === "en" ? "View all →" : "Reba zose →"}
        </Link>
      </div>

      {/* Mini map */}
      <div className="home-parish-map">
        <svg viewBox="0 0 240 160" width="100%" style={{ display:"block" }}>
          <rect width="240" height="160" fill="#EEF2FF" rx="8"/>
          <text x="120" y="65" textAnchor="middle" fill="#4B5563" fontSize="12" fontWeight="600">Rwanda</text>
          <text x="120" y="82" textAnchor="middle" fill="#8B0000" fontSize="10">Diocèse de Kabgayi</text>
          {[[100,75],[115,88],[130,82],[108,100],[125,96]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#8B0000" opacity="0.7"/>
              <circle cx={x} cy={y} r="3" fill="#D4AF37"/>
            </g>
          ))}
        </svg>
      </div>

      {/* Parish search */}
      <div className="home-parish-search">
        <label className="home-parish-search-label">
          <MapPin size={12} style={{ display:"inline", marginRight:4 }} />
          {lang === "fr" ? "Trouvez votre paroisse" : lang === "en" ? "Find your parish" : "Shaka paruwasi yawe"}
        </label>
        <div className="home-parish-search-row">
          <select className="home-parish-select">
            <option>{lang === "fr" ? "Sélectionner une paroisse" : lang === "en" ? "Select a parish" : "Hitamo paruwasi"}</option>
            {list.map((p) => <option key={p.id}>{p.name}</option>)}
          </select>
          <button className="home-parish-search-btn">
            <Search size={14} />
            {lang === "fr" ? "Chercher" : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Documents widget ────────────────────────────────────────
function DocumentsWidget({ lang }) {
  const docs = [
    { id:1, title: lang === "fr" ? "Message de Pâques" : "Easter Message" },
    { id:2, title: lang === "fr" ? "Bulletin diocésain" : "Diocesan Bulletin" },
  ];
  return (
    <div className="home-widget">
      <div className="home-widget-header">
        <FolderOpen size={15} strokeWidth={2} style={{ color:"var(--red)", flexShrink:0 }} />
        <h3>{lang === "fr" ? "DOCUMENTS OFFICIELS" : lang === "en" ? "OFFICIAL DOCUMENTS" : "INYANDIKO"}</h3>
      </div>
      <div className="home-docs-list">
        {docs.map((d) => (
          <div key={d.id} className="home-doc-item">
            <FileText size={28} strokeWidth={1.5} style={{ color:"#E74C3C", flexShrink:0 }} />
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

// ── Agenda Pastoral widget ──────────────────────────────────
function AgendaWidget({ lang }) {
  const { data } = useApi("/api/agenda", []);
  const events = Array.isArray(data) ? data : [];

  const getTitle = (e) => (lang === "en" ? e.title_en : lang === "rw" ? e.title_rw : e.title_fr) || e.title_fr || "";
  const getPlace = (e) => (lang === "en" ? e.place_en : lang === "rw" ? e.place_rw : e.place_fr) || e.place_fr || "";
  const getMonth = (e) => (lang === "en" ? e.month_en : lang === "rw" ? e.month_rw : e.month_fr) || e.month_fr || "";

  // Static fallback while API loads
  const displayEvents = events.length > 0 ? events : [
    { day:"25", month_fr:"MAI",  month_en:"MAY",  month_rw:"GICURASI", title_fr:"Pèlerinage diocésain à Kibeho",  title_en:"Diocesan pilgrimage to Kibeho",  title_rw:"Urugendo rwa diyosezi i Kibeho",  place_fr:"Basilique de Kibeho",        place_en:"Kibeho Basilica",         place_rw:"Katedrale ya Kibeho" },
    { day:"02", month_fr:"JUIN", month_en:"JUNE", month_rw:"KAMENA",   title_fr:"Ordination presbytérale",        title_en:"Priestly ordination",           title_rw:"Ubupadiri bushya",               place_fr:"Basilique de Kabgayi",       place_en:"Kabgayi Basilica",        place_rw:"Katedrale ya Kabgayi" },
    { day:"15", month_fr:"JUIN", month_en:"JUNE", month_rw:"KAMENA",   title_fr:"Retraite des jeunes",             title_en:"Youth retreat",                 title_rw:"Amahoro y'urubyiruko",           place_fr:"Centre pastoral de Kabgayi", place_en:"Kabgayi Pastoral Centre", place_rw:"Ikigo cya pastoral" },
    { day:"29", month_fr:"JUIN", month_en:"JUNE", month_rw:"KAMENA",   title_fr:"Assemblée diocésaine",            title_en:"Diocesan assembly",             title_rw:"Inteko ya diyosezi",             place_fr:"Centre pastoral de Kabgayi", place_en:"Kabgayi Pastoral Centre", place_rw:"Ikigo cya pastoral" },
  ];

  return (
    <div className="home-widget agenda-widget">
      <div className="home-widget-header">
        <CalendarDays size={15} strokeWidth={2} style={{ color:"var(--red)", flexShrink:0 }} />
        <h3>{lang === "fr" ? "AGENDA PASTORAL" : lang === "en" ? "PASTORAL AGENDA" : "GAHUNDA Y'UBUTUMWA"}</h3>
      </div>
      <div className="agenda-list">
        {displayEvents.slice(0, 4).map((ev, i) => (
          <div key={ev.id || i} className="agenda-item">
            <div className="agenda-date">
              <span className="agenda-day">{ev.day}</span>
              <span className="agenda-month">{getMonth(ev)}</span>
            </div>
            <div className="agenda-info">
              <strong className="agenda-title">{getTitle(ev)}</strong>
              <span className="agenda-place">{getPlace(ev)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Action banners ──────────────────────────────────────────
function ActionBanners({ lang }) {
  const banners = [
    {
      Icon: ClipboardList,
      title: lang === "fr" ? "Nos Projets" : lang === "en" ? "Our Projects" : "Imishinga Yacu",
      desc:  lang === "fr" ? "Découvrez nos projets pastoraux et d'évangélisation." : "Discover our pastoral and evangelization projects.",
      to:    "/pastorale/priorites",
      color: "#1A3C6E",
    },
    {
      Icon: Heart,
      title: lang === "fr" ? "FAIRE UN DON" : lang === "en" ? "MAKE A DONATION" : "TANGA IMPANO",
      desc:  lang === "fr" ? "Soutenez les œuvres du Diocèse. Votre générosité change des vies." : "Support the Diocese. Your generosity changes lives.",
      to:    "/contact",
      color: "#8B0000",
      highlighted: true,
    },
    {
      Icon: Target,
      title: lang === "fr" ? "NOS PRIORITÉS PASTORALES" : lang === "en" ? "PASTORAL PRIORITIES" : "IBINTU BY'INGENZI",
      desc:  "",
      to:    "/pastorale/priorites",
      color: "#1A3C6E",
    },
  ];

  return (
    <div className="home-banners">
      {banners.map((b, i) => (
        <Link key={i} to={b.to} className={`home-banner${b.highlighted ? " highlight" : ""}`} style={{ background: b.color }}>
          <div className="home-banner-icon">
            <b.Icon size={28} strokeWidth={1.6} color="#fff" />
          </div>
          <div className="home-banner-text">
            <strong>{b.title}</strong>
            {b.desc && <p>{b.desc}</p>}
          </div>
          <ChevronRight size={24} color="rgba(255,255,255,0.6)" style={{ flexShrink:0 }} />
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
        <Heart size={14} style={{ flexShrink:0 }} />
        {lang === "fr" ? "COMMUNIQUÉS" : "NEWS"}
      </div>
      <div className="news-ticker-track">
        <div className="news-ticker-content">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="news-ticker-item">• {item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────
export default function HomeBottomSection() {
  const { lang } = useLang();
  return (
    <>
      <section className="home-widgets-section">
        <div className="home-widgets-inner">
          <ParishesWidget lang={lang} />
          <DocumentsWidget lang={lang} />
          <AgendaWidget lang={lang} />
        </div>
      </section>

      <section className="home-banners-section">
        <div className="home-banners-inner">
          <ActionBanners lang={lang} />
        </div>
      </section>

      <NewsTicker lang={lang} />
    </>
  );
}
