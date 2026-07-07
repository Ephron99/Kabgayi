import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { Search } from "lucide-react";
import logoImg from "../assets/logo_balthazar-3-2bb20.jpg";

export default function Navbar() {
  const { t, lang } = useLang();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const location = useLocation();
  const navRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setActiveDropdown(null); setMenuOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Menu structure ──────────────────────────────────────
  const navItems = [
    {
      key: "accueil",
      label: lang === "fr" ? "Accueil" : lang === "en" ? "Home" : "Ahabanza",
      path: "/",
    },
    {
      key: "diocese",
      label: lang === "fr" ? "Diocèse" : lang === "en" ? "Diocese" : "Diyosezi",
      path: "/a-propos",
      children: [
        {
          group: lang === "fr" ? "DIOCÈSE" : lang === "en" ? "DIOCESE" : "DIYOSEZI",
          items: [
            { label: lang === "fr" ? "Carte géographique"   : lang === "en" ? "Geographic map"      : "Ikarita",               path: "/a-propos#carte" },
            { label: lang === "fr" ? "Aperçu historique"    : lang === "en" ? "Historical overview"  : "Amateka",               path: "/a-propos#histoire" },
            { label: lang === "fr" ? "État de chrétienté"   : lang === "en" ? "State of Christianity": "Itorero ubu",           path: "/a-propos#etat" },
          ],
        },
        {
          group: lang === "fr" ? "ÉVÊCHÉ" : lang === "en" ? "BISHOPRIC" : "EPISKOPI",
          items: [
            { label: lang === "fr" ? "Évêque – Biographie, blason et devise" : lang === "en" ? "Bishop – Biography & coat of arms" : "Umusenyeri",  path: "/a-propos#eveque" },
            { label: lang === "fr" ? "Vicariat Général"    : lang === "en" ? "Vicar General"         : "Vicaire Général",       path: "/a-propos#vicariat" },
            { label: lang === "fr" ? "Chancellerie"        : lang === "en" ? "Chancellery"           : "Chancellerie",          path: "/a-propos#chancellerie" },
            { label: lang === "fr" ? "Secrétariat"         : lang === "en" ? "Secretariat"           : "Secrétariat",           path: "/a-propos#secretariat" },
          ],
        },
      ],
    },
    {
      key: "services",
      label: lang === "fr" ? "Services Diocésains" : lang === "en" ? "Diocesan Services" : "Serivisi",
      path: "/services",
      children: [
        {
          group: "",
          items: [
            { label: lang === "fr" ? "Économat Général"          : lang === "en" ? "General Bursar"          : "Ubukungu Rusange",    path: "/services/economat" },
            { label: "Caritas",                                                                                                        path: "/services/caritas" },
            { label: lang === "fr" ? "Éducation Catholique"      : lang === "en" ? "Catholic Education"      : "Uburezi Gatolika",   path: "/services/education" },
            { label: lang === "fr" ? "Hôpital Kabgayi"           : lang === "en" ? "Kabgayi Hospital"        : "Ibitaro bya Kabgayi", path: "/services/hopital" },
            { label: lang === "fr" ? "Hôtel Saint André"         : lang === "en" ? "Hotel Saint André"       : "Hoteli Saint André",  path: "/services/hotel-saint-andre" },
            { label: lang === "fr" ? "Imprimerie de Kabgayi"     : lang === "en" ? "Kabgayi Print House"     : "Inzego z'Ibyapa",     path: "/services/imprimerie" },
            { label: lang === "fr" ? "Centres de Spiritualité"   : lang === "en" ? "Spirituality Centers"    : "Ibigo bya Spiritualité", path: "/services/centres-spiritualite" },
          ],
        },
        {
          group: lang === "fr" ? "ÉDUCATION" : lang === "en" ? "EDUCATION" : "UBUREZI",
          items: [
            { label: "ICK – Institut Catholique de Kabgayi",        path: "/services/ick" },
            { label: lang === "fr" ? "Institut Ste Elizabeth Kabgayi" : "Institut Ste Elizabeth Kabgayi", path: "/services/ste-elizabeth" },
            { label: lang === "fr" ? "Grand Séminaire Kabgayi"       : "Kabgayi Major Seminary",          path: "/services/grand-seminaire" },
            { label: lang === "fr" ? "Écoles Catholiques privées"    : "Private Catholic schools",        path: "/services/ecoles-privees" },
            { label: lang === "fr" ? "Écoles Catholiques Conventionnées" : "Conventional Catholic schools", path: "/services/ecoles-conventionnees" },
          ],
        },
      ],
    },
    {
      key: "paroisses",
      label: lang === "fr" ? "Paroisses" : lang === "en" ? "Parishes" : "Paruwasi",
      path: "/paroisses",
    },
    {
      key: "pastorale",
      label: lang === "fr" ? "Pastorale" : lang === "en" ? "Pastoral" : "Pastoral",
      path: "/pastorale",
      children: [
        {
          group: "",
          items: [
            { label: lang === "fr" ? "Priorités pastorales du Diocèse" : lang === "en" ? "Diocesan pastoral priorities" : "Ibintu by'Ingenzi", path: "/pastorale/priorites" },
            { label: lang === "fr" ? "Commissions diocésaines"         : lang === "en" ? "Diocesan commissions"          : "Komisiyo",          path: "/pastorale/commissions" },
            { label: lang === "fr" ? "Aumôneries"                      : lang === "en" ? "Chaplaincies"                  : "Abapadiri b'Ubutumwa", path: "/pastorale/aumoneries" },
            { label: lang === "fr" ? "Vie Consacrée"                   : lang === "en" ? "Consecrated Life"              : "Ubuzima Bwejejwe",  path: "/vie-consacree" },
          ],
        },
      ],
    },
    {
      key: "actualites",
      label: lang === "fr" ? "Actualités" : lang === "en" ? "News" : "Amakuru",
      path: "/actualites",
      children: [
        {
          group: "",
          items: [
            { label: lang === "fr" ? "Communiqués"           : lang === "en" ? "Press releases"  : "Itangazo",         path: "/actualites" },
            { label: lang === "fr" ? "Nouvelles du Diocèse"  : lang === "en" ? "Diocese news"    : "Amakuru y'Diyosezi", path: "/actualites" },
            { label: lang === "fr" ? "Événements en cours"   : lang === "en" ? "Current events"  : "Ibikorwa",          path: "/actualites" },
          ],
        },
      ],
    },
    {
      key: "publications",
      label: lang === "fr" ? "Nos Publications" : lang === "en" ? "Publications" : "Ibitangazwa",
      path: "/documentation",
      children: [
        {
          group: "",
          items: [
            { label: "Mwigisha",                                                                                              path: "/documentation/mwigisha" },
            { label: lang === "fr" ? "Train-d'union"         : lang === "en" ? "Newsletter"       : "Itangazo",         path: "/documentation/nouvelles" },
            { label: lang === "fr" ? "Homélies de l'Évêque"  : lang === "en" ? "Bishop's homilies": "Insiguro",          path: "/documentation/homelies" },
            { label: lang === "fr" ? "Urumuri Rwa Kristu"    : lang === "en" ? "Urumuri Rwa Kristu": "Urumuri Rwa Kristu", path: "/documentation/urumuri" },
            { label: lang === "fr" ? "Vidéos"                : lang === "en" ? "Videos"            : "Amashusho",         path: "/liturgie/videos" },
            { label: lang === "fr" ? "Albums Photos"         : lang === "en" ? "Photo albums"      : "Amafoto",           path: "/documentation/photos" },
          ],
        },
      ],
    },
    {
      key: "contact",
      label: lang === "fr" ? "Nous Contacter" : lang === "en" ? "Contact" : "Twunganire",
      path: "/contact",
    },
  ];

  const toggle = (key) =>
    setActiveDropdown((prev) => (prev === key ? null : key));

  return (
    <nav className={`navbar-v2${scrolled ? " sticky" : ""}`} ref={navRef} role="navigation" aria-label="Navigation principale">
      <div className="navbar-v2-inner">
        {/* Logo */}
        {/* <Link to="/" className="navbar-v2-logo" aria-label="Diocèse de Kabgayi – Accueil">
          <img src={logoImg} alt="Blason Diocèse de Kabgayi" className="navbar-v2-logo-img"
            onError={(e) => { e.target.style.display = "none"; }} />
          <div className="navbar-v2-logo-text">
            <strong>DIOCÈSE DE KABGAYI</strong>
            <em>Orate in veritate</em>
          </div>
        </Link> */}

        {/* Desktop menu */}
        <ul className="navbar-v2-menu" role="menubar">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const isOpen = activeDropdown === item.key;

            return (
              <li key={item.key}
                className={`navbar-v2-item${item.children ? " has-sub" : ""}${isOpen ? " open" : ""}`}
                role="none">
                {item.children ? (
                  <>
                    <button
                      className={`navbar-v2-link${isActive ? " active" : ""}`}
                      onClick={() => toggle(item.key)}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      role="menuitem"
                    >
                      {item.label}
                      <svg className="nav-arrow" viewBox="0 0 10 6" width="9" height="9" aria-hidden="true">
                        <path d="M0 0l5 6 5-6z" fill="currentColor"/>
                      </svg>
                    </button>

                    {/* Mega dropdown */}
                    <div className={`navbar-v2-mega${item.children.length > 1 ? " multi-col" : ""}`} role="menu">
                      {item.children.map((group, gi) => (
                        <div key={gi} className="mega-group">
                          {group.group && (
                            <div className="mega-group-title">{group.group}</div>
                          )}
                          {group.items.map((child) => (
                            <Link
                              key={child.path + child.label}
                              to={child.path}
                              className="navbar-v2-dropdown-item"
                              role="menuitem"
                            >
                              <span className="dropdown-dot" aria-hidden="true" />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`navbar-v2-link${isActive ? " active" : ""}`}
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Search button */}
        <button className="navbar-v2-search" aria-label="Rechercher">
          <Search size={18} strokeWidth={2.5} />
        </button>

        {/* Hamburger */}
        <button
          className={`hamburger-v2${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-nav" className="navbar-v2-mobile" role="menu">
          {navItems.map((item) => (
            <div key={item.key} className="navbar-v2-mobile-item">
              {item.children ? (
                <>
                  <button
                    className="navbar-v2-mobile-link"
                    onClick={() => toggle(item.key + "_m")}
                    aria-expanded={activeDropdown === item.key + "_m"}
                  >
                    {item.label}
                    <svg viewBox="0 0 10 6" width="9" height="9"
                      className={activeDropdown === item.key + "_m" ? "rotated" : ""}
                      aria-hidden="true">
                      <path d="M0 0l5 6 5-6z" fill="currentColor"/>
                    </svg>
                  </button>
                  {activeDropdown === item.key + "_m" && (
                    <div className="navbar-v2-mobile-sub">
                      {item.children.map((group, gi) => (
                        <div key={gi}>
                          {group.group && (
                            <div className="mobile-group-title">{group.group}</div>
                          )}
                          {group.items.map((child) => (
                            <Link key={child.path + child.label} to={child.path}
                              className="navbar-v2-mobile-sublink">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link to={item.path} className="navbar-v2-mobile-link">{item.label}</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
