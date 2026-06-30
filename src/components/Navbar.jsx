import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import logoImg from "../assets/logo_balthazar-3-2bb20.jpg";

export default function Navbar() {
  const { t } = useLang();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { key: "home",    label: t("nav_home"),    path: "/" },
    {
      key: "diocese", label: "Diocèse",         path: "/a-propos",
      children: [
        { label: t("nav_about"),        path: "/a-propos" },
        { label: t("nav_vie_consacree"), path: "/vie-consacree" },
      ],
    },
    { key: "actualites", label: t("nav_actualites"), path: "/actualites" },
    {
      key: "medias", label: "Médias", path: "/documentation",
      children: [
        { label: t("sub_homelies"),  path: "/documentation/homelies" },
        { label: t("sub_mwigisha"), path: "/documentation/mwigisha" },
        { label: t("sub_urumuri"),  path: "/documentation/urumuri" },
        { label: t("sub_nouvelles"),path: "/documentation/nouvelles" },
        { label: t("sub_videos"),   path: "/liturgie/videos" },
      ],
    },
    {
      key: "pastorale", label: t("nav_pastorale"), path: "/pastorale",
      children: [
        { label: t("sub_priorites"),   path: "/pastorale/priorites" },
        { label: t("sub_commissions"), path: "/pastorale/commissions" },
        { label: t("sub_aumoneries"),  path: "/pastorale/aumoneries" },
      ],
    },
    { key: "paroisses", label: t("nav_paroisses"), path: "/paroisses" },
    { key: "evenements", label: "Événements", path: "/actualites" },
    {
      key: "documents", label: "Documents", path: "/documentation",
      children: [
        { label: t("sub_homelies"),  path: "/documentation/homelies" },
        { label: t("sub_mwigisha"), path: "/documentation/mwigisha" },
        { label: t("sub_urumuri"),  path: "/documentation/urumuri" },
      ],
    },
    { key: "contact", label: "Contact", path: "/contact" },
  ];

  const toggle = (key) => setActiveDropdown((prev) => (prev === key ? null : key));

  return (
    <nav className={`navbar-v2${scrolled ? " sticky" : ""}`} ref={navRef}>
      <div className="navbar-v2-inner">
        {/* Logo */}
        <Link to="/" className="navbar-v2-logo" aria-label="Accueil – Diocèse de Kabgayi">
          <img
            src={logoImg}
            alt="Blason Diocèse de Kabgayi"
            className="navbar-v2-logo-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="navbar-v2-logo-text">
            <strong>DIOCÈSE DE KABGAYI</strong>
            <em>Orate in veritate</em>
          </div>
        </Link>

        {/* Desktop menu */}
        <ul className="navbar-v2-menu">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const isOpen = activeDropdown === item.key;

            return (
              <li key={item.key} className={`navbar-v2-item${item.children ? " has-sub" : ""}${isOpen ? " open" : ""}`}>
                {item.children ? (
                  <>
                    <button
                      className={`navbar-v2-link${isActive ? " active" : ""}`}
                      onClick={() => toggle(item.key)}
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <svg className="nav-arrow" viewBox="0 0 10 6" width="9" height="9">
                        <path d="M0 0l5 6 5-6z" fill="currentColor"/>
                      </svg>
                    </button>
                    <ul className="navbar-v2-dropdown">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link to={child.path} className="navbar-v2-dropdown-item">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={item.path} className={`navbar-v2-link${isActive ? " active" : ""}`}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Search */}
        <button className="navbar-v2-search" aria-label="Rechercher">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        {/* Hamburger (mobile) */}
        <button
          className={`hamburger-v2${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-v2-mobile">
          {navItems.map((item) => (
            <div key={item.key} className="navbar-v2-mobile-item">
              {item.children ? (
                <>
                  <button
                    className="navbar-v2-mobile-link"
                    onClick={() => toggle(item.key + "_m")}
                  >
                    {item.label}
                    <svg viewBox="0 0 10 6" width="9" height="9" className={activeDropdown === item.key + "_m" ? "rotated" : ""}>
                      <path d="M0 0l5 6 5-6z" fill="currentColor"/>
                    </svg>
                  </button>
                  {activeDropdown === item.key + "_m" && (
                    <div className="navbar-v2-mobile-sub">
                      {item.children.map((c) => (
                        <Link key={c.path} to={c.path} className="navbar-v2-mobile-sublink">{c.label}</Link>
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
