import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import logoImg from "../assets/logo_balthazar-3-2bb20.jpg";
import { useApi } from "../hooks/useApi";

/* Desktop: inline vertical tree — sub menus shown on the same column,
   deeper levels (sub-sub, sub-sub-sub …) collapsed until the toggle is pressed. */
export function MenuNode({ item, path, depth = 0 }) {
  const hasChildren = item.children?.length > 0;
  const [open, setOpen] = useState(false);

  return (
    <div className={`nv2-node${hasChildren ? " has-children" : ""} d${Math.min(depth, 4)}`}>
      <div className="nv2-node-row">
        <Link
          to={item.path}
          className="nv2-node-link"
          role="menuitem"
        >
          <span className="nv2-node-label">{item.label}</span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            className={`nv2-node-toggle${open ? " open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? `Réduire ${item.label}` : `Développer ${item.label}`}
          >
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="nv2-children">
          {item.children.map((child) => (
            <MenuNode key={path + child.path} item={child} path={path + child.path} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Mobile: collapsible sub-menu tree (tap chevron to expand / collapse) */
export function MobileMenuItemList({ items, depth = 0 }) {
  const [openPaths, setOpenPaths] = useState(() => new Set());

  const togglePath = (p) =>
    setOpenPaths((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });

  return items.map((item) => {
    const hasChildren = item.children?.length > 0;
    const isOpen = openPaths.has(item.path);
    return (
      <div key={item.path + item.label} className={`m-sub-node d${Math.min(depth, 3)}`}>
        <div className="m-sub-row">
          <Link to={item.path} className="navbar-v2-mobile-sublink">
            {item.label}
          </Link>
          {hasChildren && (
            <button
              type="button"
              className={`m-sub-toggle${isOpen ? " open" : ""}`}
              onClick={() => togglePath(item.path)}
              aria-expanded={isOpen}
              aria-label={isOpen ? `Réduire ${item.label}` : `Développer ${item.label}`}
            >
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        {hasChildren && isOpen && (
          <div className="m-sub-children">
            <MobileMenuItemList items={item.children} depth={depth + 1} />
          </div>
        )}
      </div>
    );
  });
}

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

  // Build pastoral menu structure — a single vertical tree where the
  // top-level items are the visible sub-menus and every deeper level
  // (sub-sub, sub-sub-sub …) stays collapsed behind a toggle.
  const buildPastoralMenu = () => {
    const rootItems = [];

    if (pastoralItems && Array.isArray(pastoralItems)) {
      const activePastoralItems = pastoralItems.filter(item => item.is_active);
      activePastoralItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      const itemById = new Map(activePastoralItems.map(item => [item.id, item]));
      const childrenByParent = new Map();

      activePastoralItems.forEach((item) => {
        const parentId = itemById.has(item.parent_id) ? item.parent_id : null;
        const children = childrenByParent.get(parentId) || [];
        children.push(item);
        childrenByParent.set(parentId, children);
      });

      const toMenuItem = (item, ancestorIds = new Set()) => {
        if (ancestorIds.has(item.id)) return null;
        const nextAncestors = new Set(ancestorIds).add(item.id);
        return {
          label: item[`name_${lang}`] || item.name_fr,
          path: `/pastorale/${item.slug}`,
          children: (childrenByParent.get(item.id) || [])
            .map(child => toMenuItem(child, nextAncestors))
            .filter(Boolean)
        };
      };

      (childrenByParent.get(null) || []).forEach(item => {
        const node = toMenuItem(item);
        if (node) rootItems.push(node);
      });
    }

    if (services && Array.isArray(services)) {
      const educationItems = services.filter(item => item.is_active && item.section === "education");
      educationItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      if (educationItems.length > 0) {
        rootItems.push({
          label: lang === "fr" ? "ÉDUCATION" : lang === "en" ? "EDUCATION" : "UBUREZI",
          path: "/education",
          children: educationItems.map(item => ({
            label: item[`name_${lang}`] || item.name_fr,
            path: `/services/${item.slug}`,
            children: []
          }))
        });
      }
    }

    return [{ group: "", items: rootItems }];
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
    // {
    //   key: "actualites",
    //   label: lang === "fr" ? "Actualités" : lang === "en" ? "News" : "Amakuru",
    //   path: "/actualites",
    //   children: [
    //     {
    //       group: "",
    //       items: [
    //         { label: lang === "fr" ? "Communiqués"           : lang === "en" ? "Press releases"  : "Itangazo",         path: "/actualites" },
    //         { label: lang === "fr" ? "Nouvelles du Diocèse"  : lang === "en" ? "Diocese news"    : "Amakuru y'Diyosezi", path: "/actualites" },
    //         { label: lang === "fr" ? "Événements en cours"   : lang === "en" ? "Current events"  : "Ibikorwa",          path: "/actualites" },
    //       ],
    //     },
    //   ],
    // },
    {
      key: "actualites",
      label: lang === "fr" ? "actualites" : lang === "en" ? "News" : "Amakuru",
      path: "/actualites",
    },
    {
      key: "publications",
      label: lang === "fr" ? "Publications" : lang === "en" ? "Publications" : "Ibitangazwa",
      path: "",
      children: [
        {
          group: "",
          items: [
            { label: "Mwigisha",                                                                                              path: "" },
            { label: lang === "fr" ? "Train-d'union"         : lang === "en" ? "Newsletter"       : "Itangazo",         path: "" },
            { label: lang === "fr" ? "Homélies de l'Évêque"  : lang === "en" ? "Bishop's homilies": "Insiguro",          path: "" },
            { label: lang === "fr" ? "Urumuri Rwa Kristu"    : lang === "en" ? "Urumuri Rwa Kristu": "Urumuri Rwa Kristu", path: "" },
            { label: lang === "fr" ? "Vidéos"                : lang === "en" ? "Videos"            : "Amashusho",         path: "" },
            { label: lang === "fr" ? "Albums Photos"         : lang === "en" ? "Photo albums"      : "Amafoto",           path: "" },
          ],
        },
      ],
    },
    {
      key: "contact",
      label: lang === "fr" ? "Contacter" : lang === "en" ? "Contact" : "Twunganire",
      path: "/contact",
    },
  ];

  const toggle = (key) =>
    setActiveDropdown((prev) => (prev === key ? null : key));

  return (
    <nav className={`navbar-v2${scrolled ? " sticky" : ""}`} ref={navRef} role="navigation" aria-label="Navigation principale">
      <div className="navbar-v2-inner">
        {/* Logo */}
        <Link to="/" className="navbar-v2-logo" aria-label="Diocèse de Kabgayi – Accueil">
          <img src={logoImg} alt="Blason Diocèse de Kabgayi" className="navbar-v2-logo-img"
            onError={(e) => { e.target.style.display = "none"; }} />
          <div className="navbar-v2-logo-text">
            <strong>DIOCÈSE DE KABGAYI</strong>
            <span>Orate in veritate</span>
          </div>
        </Link>

        {/* Desktop menu */}
        <ul className="navbar-v2-menu" role="menubar">
          {navItems.map((item) => {
            const isActive =
              !!item.path && (
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path))
              );
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
                            group.groupLink ? (
                              <Link
                                to={group.groupLink}
                                className="mega-group-title mega-group-link"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {group.group}
                                <ChevronRight size={13} aria-hidden="true" />
                              </Link>
                            ) : (
                              <div className="mega-group-title">{group.group}</div>
                            )
                          )}
                          {group.items.map((sub) => (
                            <MenuNode key={sub.path + sub.label} item={sub} path={sub.path} />
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
                              group.groupLink ? (
                                <Link to={group.groupLink} className="mobile-group-title mobile-group-link">
                                  {group.group}
                                </Link>
                              ) : (
                                <div className="mobile-group-title">{group.group}</div>
                              )
                            )}
                            <MobileMenuItemList items={group.items} />
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
