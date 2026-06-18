import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 60 60" width="52" height="52" aria-hidden="true">
                <circle cx="30" cy="30" r="28" fill="#8B0000" stroke="#D4AF37" strokeWidth="2"/>
                <text x="30" y="38" textAnchor="middle" fill="#D4AF37" fontSize="22" fontFamily="serif" fontWeight="bold">✝</text>
              </svg>
              <div>
                <span className="footer-logo-title">Diocèse</span>
                <span className="footer-logo-sub">de Kabgayi</span>
              </div>
            </div>
            <p className="footer-desc">{t("footer_desc")}</p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/diocesedekabgayi" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/diocesedekabgayi" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/diocesedekabgayi" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#8B0000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
              <a href="mailto:info@diocesedekabgayi.org" className="footer-social" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="footer-col" aria-label="Liens rapides">
            <h3 className="footer-col-title">{t("footer_links")}</h3>
            <ul className="footer-links">
              <li><Link to="/">{t("nav_home")}</Link></li>
              <li><Link to="/a-propos">{t("nav_about")}</Link></li>
              <li><Link to="/services">{t("nav_services")}</Link></li>
              <li><Link to="/actualites">{t("nav_actualites")}</Link></li>
              <li><Link to="/paroisses">{t("nav_paroisses")}</Link></li>
              <li><Link to="/contact">{t("page_contact")}</Link></li>
            </ul>
          </nav>

          {/* Media */}
          <nav className="footer-col" aria-label="Médias">
            <h3 className="footer-col-title">{t("footer_media")}</h3>
            <ul className="footer-links">
              <li><a href="#radio">Radio Maria Rwanda</a></li>
              <li><a href="#tv">Pacis TV</a></li>
              <li><Link to="/documentation/homelies">{t("sub_homelies")}</Link></li>
              <li><Link to="/documentation/mwigisha">{t("sub_mwigisha")}</Link></li>
              <li><Link to="/documentation/urumuri">{t("sub_urumuri")}</Link></li>
              <li><Link to="/liturgie/videos">{t("sub_videos")}</Link></li>
            </ul>
          </nav>

          {/* Services */}
          <nav className="footer-col" aria-label="Services">
            <h3 className="footer-col-title">{t("footer_services_f")}</h3>
            <ul className="footer-links">
              <li><Link to="/services/caritas">{t("sub_caritas")}</Link></li>
              <li><Link to="/services/hopital">{t("sub_hopital")}</Link></li>
              <li><Link to="/services/education">{t("sub_education")}</Link></li>
              <li><Link to="/services/imprimerie">{t("sub_imprimerie")}</Link></li>
              <li><Link to="/services/institut-catholique">{t("sub_institut")}</Link></li>
              <li><Link to="/services/hotel-saint-andre">{t("sub_hotel")}</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="footer-col footer-contact" aria-label="Coordonnées">
            <h3 className="footer-col-title">{t("footer_contact")}</h3>
            <ul className="footer-contact-list">
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {t("contact_address")}
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href={`tel:${t("contact_phone").replace(/\s/g, "")}`}>{t("contact_phone")}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href={`mailto:${t("contact_email")}`}>{t("contact_email")}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <a href={`https://${t("contact_web")}`} target="_blank" rel="noopener noreferrer">{t("contact_web")}</a>
              </li>
            </ul>
          </address>
        </div>

        <div className="footer-bottom">
          <p>{t("footer_rights")}</p>
          <div className="footer-bottom-links">
            <Link to="/mentions-legales">{t("footer_legal")}</Link>
            <span aria-hidden="true">·</span>
            <Link to="/confidentialite">{t("footer_privacy")}</Link>
            <span aria-hidden="true">·</span>
            <a href="/admin" style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Portail Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
