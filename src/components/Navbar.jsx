import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { Search } from "lucide-react";
import logoImg from "../assets/logo_balthazar-3-2bb20.jpg";
import { useApi } from "../hooks/useApi";

export default function Navbar() {
  const { t, lang } = useLang();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const location = useLocation();
  const navRef   = useRef(null);
  const { data: pastoralItems, error: pastoralError } = useApi("/api/pastoral", []);
  const { data: services, error: servicesError } = useApi("/api/services", []);

  if (pastoralError) console.error("[Navbar] Failed to load pastoral items:", pastoralError);
  if (servicesError) console.error("[Navbar] Failed to load services:", servicesError);

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

  // Build services menu structure
  const buildServicesMenu = () => {
    if (!services || !Array.isArray(services)) return [];

    // Filter active items, only services section (no education)
    const activeItems = services.filter(item => item.is_active && item.section === "services");
    if (activeItems.length === 0) return [];

    // Sort by sort_order
    activeItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Build menu groups
    return [
      {
        group: "",
        items: activeItems.map(item => ({
          label: item[`name_${lang}`] || item.name_fr,
          path: `/services/${item.slug}`
        }))
      }
    ];
  };

  // Build pastoral menu structure
  const buildPastoralMenu = () => {
    const menuGroups = [];

    if (pastoralItems && Array.isArray(pastoralItems)) {
      const activePastoralItems = pastoralItems.filter(item => item.is_active);
      activePastoralItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      const topLevel = activePastoralItems.filter(item => !item.parent_id);
      const children = activePastoralItems.filter(item => item.parent_id);

      const standaloneTopLevel = topLevel.filter(parent =>
        !children.some(child => child.parent_id === parent.id)
      );

      if (standaloneTopLevel.length > 0) {
        menuGroups.push({
          group: "",
          items: standaloneTopLevel.map(item => ({
            label: item[`name_${lang}`] || item.name_fr,
            path: `/pastorale/${item.slug}`
          }))
        });
      }

      topLevel.forEach(parent => {
        const parentChildren = children.filter(c => c.parent_id === parent.id);
        if (parentChildren.length > 0) {
          menuGroups.push({
            group: parent[`name_${lang}`] || parent.name_fr,
            items: parentChildren.map(child => ({
              label: child[`name_${lang}`] || child.name_fr,
              path: `/pastorale/${child.slug}`
            }))
          });
        }
      });

      const orphanChildren = children.filter(c =>
        !topLevel.some(p => p.id === c.parent_id)
      );
      if (orphanChildren.length > 0) {
        menuGroups.push({
          group: "",
          items: orphanChildren.map(item => ({
            label: item[`name_${lang}`] || item.name_fr,
            path: `/pastorale/${item.slug}`
          }))
        });
      }
    }

    if (services && Array.isArray(services)) {
      const educationItems = services.filter(item => item.is_active && item.section === "education");
      educationItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      if (educationItems.length > 0) {
        menuGroups.push({
          group: lang === "fr" ? "ÉDUCATION" : lang === "en" ? "EDUCATION" : "UBUREZI",
          items: educationItems.map(item => ({
            label: item[`name_${lang}`] || item.name_fr,
            path: `/services/${item.slug}`
          }))
        });
      }
    }

    return menuGroups;
  };

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
    },
    {
      key: "services",
      label: lang === "fr" ? "Services Diocésains" : lang === "en" ? "Diocesan Services" : "Serivisi",
      path: "/services",
      children: buildServicesMenu(),
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
      children: buildPastoralMenu(),
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
    // {
    //   key: "publications",
    //   label: lang === "fr" ? "Nos Publications" : lang === "en" ? "Publications" : "Ibitangazwa",
    //   path: "/documentation",
    //   children: [
    //     {
    //       group: "",
    //       items: [
    //         { label: "Mwigisha",                                                                                              path: "/documentation/mwigisha" },
    //         { label: lang === "fr" ? "Train-d'union"         : lang === "en" ? "Newsletter"       : "Itangazo",         path: "/documentation/nouvelles" },
    //         { label: lang === "fr" ? "Homélies de l'Évêque"  : lang === "en" ? "Bishop's homilies": "Insiguro",          path: "/documentation/homelies" },
    //         { label: lang === "fr" ? "Urumuri Rwa Kristu"    : lang === "en" ? "Urumuri Rwa Kristu": "Urumuri Rwa Kristu", path: "/documentation/urumuri" },
    //         { label: lang === "fr" ? "Vidéos"                : lang === "en" ? "Videos"            : "Amashusho",         path: "/liturgie/videos" },
    //         { label: lang === "fr" ? "Albums Photos"         : lang === "en" ? "Photo albums"      : "Amafoto",           path: "/documentation/photos" },
    //       ],
    //     },
    //   ],
    // },
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
            const hasChildren = item.children && item.children.length > 0;

            return (
              <li key={item.key}
                className={`navbar-v2-item${hasChildren ? " has-sub" : ""}${isOpen ? " open" : ""}`}
                role="none">
                {hasChildren ? (
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
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            return (
              <div key={item.key} className="navbar-v2-mobile-item">
                {hasChildren ? (
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
            );
          })}
        </div>
      )}
    </nav>
  );
}
