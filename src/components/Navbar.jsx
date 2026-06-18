import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import eveque from '../assets/logo_balthazar-3-2bb20.jpg';
const LANG_FLAGS = {
  fr: { label: "Français", flag: "🇫🇷" },
  en: { label: "English", flag: "🇬🇧" },
  rw: { label: "Kinyarwanda", flag: "🇷🇼" },
};

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
    setLangOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setLangOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { key: "home", label: t("nav_home"), path: "/" },
    { key: "about", label: t("nav_about"), path: "/a-propos" },
    {
      key: "services",
      label: t("nav_services"),
      path: "/services",
      children: [
        { label: t("sub_economat"), path: "/services/economat" },
        { label: t("sub_caritas"), path: "/services/caritas" },
        { label: t("sub_education"), path: "/services/education" },
        { label: t("sub_hopital"), path: "/services/hopital" },
        { label: t("sub_hotel"), path: "/services/hotel-saint-andre" },
        { label: t("sub_imprimerie"), path: "/services/imprimerie" },
        { label: t("sub_centres"), path: "/services/centres-spiritualite" },
        { label: t("sub_institut"), path: "/services/institut-catholique" },
      ],
    },
    {
      key: "pastorale",
      label: t("nav_pastorale"),
      path: "/pastorale",
      children: [
        { label: t("sub_priorites"), path: "/pastorale/priorites" },
        { label: t("sub_commissions"), path: "/pastorale/commissions" },
        { label: t("sub_aumoneries"), path: "/pastorale/aumoneries" },
      ],
    },
    { key: "paroisses", label: t("nav_paroisses"), path: "/paroisses" },
    { key: "vie_consacree", label: t("nav_vie_consacree"), path: "/vie-consacree" },
    {
      key: "actualites",
      label: t("nav_actualites"),
      path: "/actualites",
    },
    {
      key: "documentation",
      label: t("nav_documentation"),
      path: "/documentation",
      children: [
        { label: t("sub_homelies"), path: "/documentation/homelies" },
        { label: t("sub_mwigisha"), path: "/documentation/mwigisha" },
        { label: t("sub_urumuri"), path: "/documentation/urumuri" },
        { label: t("sub_nouvelles"), path: "/documentation/nouvelles" },
      ],
    },
    {
      key: "accueil_liturgique",
      label: t("nav_accueil_liturgique"),
      path: "/liturgie",
      children: [
        { label: t("sub_liturgie"), path: "/liturgie/jour" },
        { label: t("sub_videos"), path: "/liturgie/videos" },
      ],
    },
  ];

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`} ref={navRef} role="navigation" aria-label="Navigation principale">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="Accueil – Diocèse de Kabgayi">
          <div className="navbar-logo-icon">
           <img src={eveque} alt="Évêque du Diocèse de Kabgayi" />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-logo-title">Diocèse</span>
            <span className="navbar-logo-sub">de Kabgayi</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar-menu" role="menubar">
          {navItems.map((item) => (
            <li
              key={item.key}
              className={`navbar-item${item.children ? " has-dropdown" : ""}${activeDropdown === item.key ? " open" : ""}`}
              role="none"
            >
              {item.children ? (
                <>
                  <button
                    className={`navbar-link${location.pathname.startsWith(item.path) ? " active" : ""}`}
                    onClick={() => toggleDropdown(item.key)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.key}
                    role="menuitem"
                  >
                    {item.label}
                    <svg className="dropdown-arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                      <path d="M0 0l5 6 5-6z" fill="currentColor" />
                    </svg>
                  </button>
                  <ul className="dropdown-menu" role="menu">
                    {item.children.map((child) => (
                      <li key={child.path} role="none">
                        <Link
                          to={child.path}
                          className="dropdown-item"
                          role="menuitem"
                        >
                          <span className="dropdown-item-dot" aria-hidden="true"></span>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`navbar-link${location.pathname === item.path ? " active" : ""}`}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Language Switcher */}
        <div className="lang-switcher">
          <button
            className="lang-btn"
            onClick={() => setLangOpen(!langOpen)}
            aria-haspopup="true"
            aria-expanded={langOpen}
            aria-label="Changer de langue"
          >
            <span>{LANG_FLAGS[lang].flag}</span>
            <span>{LANG_FLAGS[lang].label}</span>
            <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
              <path d="M0 0l5 6 5-6z" fill="currentColor" />
            </svg>
          </button>
          {langOpen && (
            <ul className="lang-menu" role="menu" aria-label="Sélection de langue">
              {Object.entries(LANG_FLAGS).map(([code, { label, flag }]) => (
                <li key={code} role="none">
                  <button
                    className={`lang-option${lang === code ? " active" : ""}`}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                    role="menuitem"
                    lang={code}
                  >
                    <span>{flag}</span> {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {navItems.map((item) => (
          <div key={item.key} className="mobile-item">
            {item.children ? (
              <>
                <button
                  className="mobile-link mobile-link--parent"
                  onClick={() => toggleDropdown(item.key + "_m")}
                  aria-expanded={activeDropdown === item.key + "_m"}
                >
                  {item.label}
                  <svg className={`dropdown-arrow${activeDropdown === item.key + "_m" ? " rotated" : ""}`} viewBox="0 0 10 6" width="10" height="6">
                    <path d="M0 0l5 6 5-6z" fill="currentColor" />
                  </svg>
                </button>
                {activeDropdown === item.key + "_m" && (
                  <div className="mobile-submenu">
                    {item.children.map((child) => (
                      <Link key={child.path} to={child.path} className="mobile-sublink">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link to={item.path} className="mobile-link">
                {item.label}
              </Link>
            )}
          </div>
        ))}
        {/* Mobile Lang */}
        <div className="mobile-lang">
          {Object.entries(LANG_FLAGS).map(([code, { label, flag }]) => (
            <button
              key={code}
              className={`mobile-lang-btn${lang === code ? " active" : ""}`}
              onClick={() => setLang(code)}
              lang={code}
            >
              {flag} {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
