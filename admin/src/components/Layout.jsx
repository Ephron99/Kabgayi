import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../admin.css";

const NAV = [
  { section: "GÉNÉRAL" },
  { to: "/",          icon: "📊", label: "Tableau de bord" },
  { section: "CONTENU" },
  { to: "/hero",      icon: "🖼️", label: "Slides Hero" },
  { to: "/news",      icon: "📰", label: "Actualités" },
  { to: "/parishes",  icon: "⛪", label: "Paroisses" },
  { section: "COMMUNICATION" },
  { to: "/messages",  icon: "✉️", label: "Messages", badgeKey: "messages" },
  { section: "SYSTÈME" },
  { to: "/settings",  icon: "⚙️", label: "Paramètres" },
  { to: "/users",     icon: "👥", label: "Utilisateurs", adminOnly: true },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitles = {
    "/":          "Tableau de bord",
    "/hero":      "Slides Hero",
    "/news":      "Actualités",
    "/parishes":  "Paroisses",
    "/messages":  "Messages",
    "/settings":  "Paramètres",
    "/users":     "Utilisateurs",
  };
  const title = pageTitles[location.pathname] || "Admin";

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✝</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-title">Diocèse de Kabgayi</div>
            <div className="sidebar-brand-sub">Portail Administratif</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.section) {
              return <div key={i} className="sidebar-section">{item.section}</div>;
            }
            if (item.adminOnly && user?.role !== "superadmin") return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout}>
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <span>{title}</span>
          </div>
          <div className="admin-header-right">
            <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
              Connecté en tant que <strong>{user?.name}</strong>
            </span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
