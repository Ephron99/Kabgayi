import { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminLang } from "../context/AdminLangContext";
import "../admin.css";
import { LayoutDashboard, Image, Newspaper, Church, Mail, Settings, Users, DoorOpen, Cross, CalendarDays, HeartHandshake, Menu, X } from "lucide-react";
const LANG_OPTIONS = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "rw", flag: "🇷🇼", label: "Kinyarwanda" },
];

export default function Layout({ children }) {
  const { user, logout }   = useAdminAuth();
  const { t, lang, setLang } = useAdminLang();
  const location           = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Close sidebar on Escape key (mobile)
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const NAV = [
  { section: t("general") },
  { to: "/admin",          icon: LayoutDashboard, label: t("dashboard"),   exact: true },
  { section: t("content") },
  { to: "/admin/hero",     icon: Image,           label: t("hero_slides") },
  { to: "/admin/news",     icon: Newspaper,       label: t("news") },
  { to: "/admin/parishes", icon: Church,          label: t("parishes") },
  { to: "/admin/services", icon: HeartHandshake,  label: "Services Diocésains" },
  { to: "/admin/pastoral", icon: HeartHandshake,  label: "Pastoral" },
  { to: "/admin/bishop",   icon: Cross,           label: "Message Évêque" },
  { to: "/admin/about",    icon: Church,          label: "Page À Propos" },
  { to: "/admin/agenda",   icon: CalendarDays,    label: "AGENDA PASTORAL 2026/2027" },
  { section: t("communication") },
  { to: "/admin/messages", icon: Mail,            label: t("messages") },
  { section: t("system") },
  { to: "/admin/settings", icon: Settings,        label: t("settings") },
  { to: "/admin/users",    icon: Users,           label: t("users"), adminOnly: true },
];

  // Derive page title from pathname
  const seg = location.pathname.replace("/admin", "").replace(/^\//, "").split("/")[0];
  const titleMap = {
    "":         t("dashboard"),
    "hero":     t("hero_slides"),
    "news":     t("news"),
    "parishes": t("parishes"),
    "services": "Services Diocésains",
    "pastoral": "Pastoral",
    "about":    "Page À Propos",
    "messages": t("messages"),
    "settings": t("settings"),
    "users":    t("users"),
  };
  const pageTitle = titleMap[seg] || "Admin";

  return (
    <div className="admin-layout">
      {/* ── Mobile sidebar overlay ─────────────────── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><Cross size={24} color="#fff" /></div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-title">Diocèse de Kabgayi</div>
            <div className="sidebar-brand-sub">{t("admin_portal")}</div>
          </div>
          {/* Close button (mobile only) */}
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.section) return (
              <div key={i} className="sidebar-section">{item.section}</div>
            );
            if (item.adminOnly && user?.role !== "superadmin") return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="sidebar-link-icon">
                  {(() => { const Icon = item.icon; return <Icon size={18} />; })()}
                </span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* Language switcher */}
          <div className="sidebar-lang">
            <button
              className="sidebar-lang-btn"
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
            >
              {LANG_OPTIONS.find((l) => l.code === lang)?.flag}{" "}
              {LANG_OPTIONS.find((l) => l.code === lang)?.label}
              <svg viewBox="0 0 10 6" width="10" height="6" style={{ marginLeft: "auto" }}>
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </button>
            {langOpen && (
              <div className="sidebar-lang-menu">
                {LANG_OPTIONS.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    className={`sidebar-lang-opt${lang === code ? " active" : ""}`}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                  >
                    {flag} {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sidebar-divider" />

          {/* User info */}
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>

          {/* Back to site */}
          <Link to="/" className="sidebar-back-site">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {t("back_site")}
          </Link>

          {/* Logout */}
          <button className="sidebar-logout" onClick={logout}>
            <span><DoorOpen size={26} /> </span> {t("logout")}
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────── */}
      <div className="admin-main">
        <header className="admin-header">
          {/* Mobile hamburger button */}
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="admin-header-title">{pageTitle}</div>
          <div className="admin-header-right">
            <span className="admin-header-user">
              {t("logged_as")} <strong>{user?.name}</strong>
            </span>
            {/* Inline language switcher for header */}
            <div className="admin-header-langs">
              {LANG_OPTIONS.map(({ code, flag }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  title={LANG_OPTIONS.find(l => l.code === code)?.label}
                  className={`admin-lang-flag${lang === code ? " active" : ""}`}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}