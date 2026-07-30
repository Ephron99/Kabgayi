import { useLang } from "../context/LanguageContext";
import { Calendar, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logo_balthazar-3-2bb20.jpg";

// Brand icon SVGs (not in lucide-react v1.21)
const FbIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YtIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>;
const TwIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IgIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

export default function TopBar() {
  const { t, lang, setLang } = useLang();

  const langs = [
    { code: "fr", flag: "🇫🇷" },
    { code: "en", flag: "🇬🇧" },
    { code: "rw", flag: "🇷🇼" },
  ];

  return (
    <div className="topbar-new">
      <div className="topbar-new-inner">
        {/* Left — logo + name */}
        {/* Logo */}
        <Link to="/" className="navbar-v2-logo" aria-label="Accueil – Diocèse de Kabgayi">
          <img
            src={logoImg}
            alt="Blason Diocèse de Kabgayi"
            className="navbar-v2-logo-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="navbar-v2-logo-text">
            <h3>DIOCÈSE DE KABGAYI</h3>
            <em>Orate in veritate</em>
          </div>
        </Link>

        {/* Right — actions + lang */}
        <div className="topbar-new-right">
          <div className="topbar-new-actions">
            <a href="/liturgie/jour" className="topbar-action-btn">
              <Calendar size={14} strokeWidth={2} />
              {lang === "fr" ? "Horaire des messes" : lang === "en" ? "Mass schedule" : "Amasaha y'imisa"}
            </a>
            <a href="/contact" className="topbar-action-btn">
              <Mail size={14} strokeWidth={2} />
              Newsletter
            </a>
            <div className="topbar-social-group">
              <a href="https://www.facebook.com/diocesedekabgayi" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="topbar-new-social"><FbIcon /></a>
              <a href="https://www.youtube.com/diocesedekabgayi"  target="_blank" rel="noopener noreferrer" aria-label="YouTube"   className="topbar-new-social"><YtIcon /></a>
              <a href="https://twitter.com/diocesekabgayi"        target="_blank" rel="noopener noreferrer" aria-label="Twitter"   className="topbar-new-social"><TwIcon /></a>
              <a href="https://www.instagram.com/diocesedekabgayi"target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="topbar-new-social"><IgIcon /></a>
              <span className="topbar-social-label">Social medias</span>
            </div>
          </div>

          {/* Language flags */}
          <div className="topbar-new-langs">
            <span className="topbar-langs-label">Langues</span>
            {langs.map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`topbar-lang-flag${lang === code ? " active" : ""}`}
                title={code === "fr" ? "Français" : code === "en" ? "English" : "Kinyarwanda"}
                aria-label={code}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
