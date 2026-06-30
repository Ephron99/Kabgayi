import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="footer-v2">
      <div className="footer-v2-inner">
        <div className="footer-v2-grid">

          {/* Brand */}
          <div className="footer-v2-brand">
            <div className="footer-v2-logo">
              <div className="footer-v2-logo-icon">✝</div>
              <div>
                <strong className="footer-v2-logo-title">DIOCÈSE DE KABGAYI</strong>
                <em className="footer-v2-logo-sub">Orate in veritate</em>
              </div>
            </div>
            <p className="footer-v2-desc">
              {lang === "fr"
                ? "Annoncer l'Évangile, célébrer la Foi et servir chaque personne pour une société réconciliée dans le Christ."
                : lang === "en"
                ? "Proclaiming the Gospel, celebrating the Faith and serving every person for a society reconciled in Christ."
                : "Gutangaza Ubutumwa Bwiza, gusenga no gukora umuntu wese kugira ngo umuryango uhuze muri Kristu."}
            </p>
            <div className="footer-v2-socials">
              {[
                { href:"https://www.facebook.com/diocesedekabgayi", label:"Facebook", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { href:"https://www.youtube.com/diocesedekabgayi", label:"YouTube", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#1A1A2E" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg> },
                { href:"https://twitter.com/diocesekabgayi", label:"Twitter", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { href:"https://www.instagram.com/diocesedekabgayi", label:"Instagram", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
              ].map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-v2-social" aria-label={label}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav className="footer-v2-col">
            <h4 className="footer-v2-col-title">{lang === "fr" ? "LIENS RAPIDES" : lang === "en" ? "QUICK LINKS" : "IBIBUZWA VUBA"}</h4>
            <ul className="footer-v2-links">
              <li><Link to="/">{lang === "fr" ? "Accueil" : lang === "en" ? "Home" : "Ahabanza"}</Link></li>
              <li><Link to="/a-propos">{lang === "fr" ? "Diocèse" : lang === "en" ? "Diocese" : "Diyosezi"}</Link></li>
              <li><Link to="/actualites">{lang === "fr" ? "Actualités" : lang === "en" ? "News" : "Amakuru"}</Link></li>
              <li><Link to="/documentation">{lang === "fr" ? "Médias" : lang === "en" ? "Media" : "Itangazamakuru"}</Link></li>
              <li><Link to="/pastorale">{lang === "fr" ? "Pastorale" : lang === "en" ? "Pastoral" : "Pastoral"}</Link></li>
            </ul>
          </nav>

          {/* Parishes */}
          <nav className="footer-v2-col">
            <h4 className="footer-v2-col-title">{lang === "fr" ? "PAROISSES" : lang === "en" ? "PARISHES" : "PARUWASI"}</h4>
            <ul className="footer-v2-links">
              <li><Link to="/paroisses">{lang === "fr" ? "Paroisses" : "Parishes"}</Link></li>
              <li><Link to="/paroisses">{lang === "fr" ? "Mouvements" : "Movements"}</Link></li>
              <li><Link to="/services">{lang === "fr" ? "Services diocésains" : "Diocesan services"}</Link></li>
              <li><Link to="/vie-consacree">{lang === "fr" ? "Vie consacrée" : "Consecrated life"}</Link></li>
              <li><Link to="/services/education">{lang === "fr" ? "Écoles catholiques" : "Catholic schools"}</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="footer-v2-col">
            <h4 className="footer-v2-col-title">{lang === "fr" ? "CONTACT" : "CONTACT"}</h4>
            <ul className="footer-v2-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                BP 60 Kabgayi – Rwanda
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:+250786535173">+250 786 535 173</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:info@diocesekabgayi.rw">info@diocesekabgayi.rw</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <a href="https://www.diocesekabgayi.rw" target="_blank" rel="noopener noreferrer">www.diocesekabgayi.rw</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Lun – Ven : 8h00 – 17h00
              </li>
            </ul>
          </address>

          {/* Location map */}
          <div className="footer-v2-col footer-v2-map-col">
            <h4 className="footer-v2-col-title">LOCALISATION</h4>
            <div className="footer-v2-map">
              <svg viewBox="0 0 200 140" width="100%">
                <rect width="200" height="140" fill="#E8EDF5" rx="6"/>
                <text x="100" y="60" textAnchor="middle" fill="#4B5563" fontSize="11">Rwanda</text>
                <circle cx="100" cy="80" r="10" fill="#8B0000" opacity="0.7"/>
                <circle cx="100" cy="80" r="5"  fill="#D4AF37"/>
                <text x="100" y="110" textAnchor="middle" fill="#8B0000" fontSize="10" fontWeight="600">Kabgayi</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-v2-bottom">
          <p>© 2024 Diocèse de Kabgayi – Tous droits réservés</p>
          <div className="footer-v2-bottom-links">
            <Link to="/mentions-legales">{lang === "fr" ? "Mentions légales" : "Legal notice"}</Link>
            <span>·</span>
            <Link to="/confidentialite">{lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}</Link>
            <span>·</span>
            <a href="/admin">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
