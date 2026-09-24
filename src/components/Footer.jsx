import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import logoImg from "../assets/logo_balthazar-3-2bb20.jpg";
import { MapPin, Phone, Mail, Globe, Clock, Cross } from "lucide-react";

const FbIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YtIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#1A1A2E" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>;
const TwIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IgIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="footer-v2">
      <div className="footer-v2-inner">
        <div className="footer-v2-grid">

          {/* Brand */}
          <div className="footer-v2-brand">
            <div className="footer-v2-logo">
              <img src={logoImg} alt="Blason Diocèse de Kabgayi" className="navbar-v2-logo-img"
            onError={(e) => { e.target.style.display = "none"; }} />
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
                { href:"https://www.facebook.com/diocesedekabgayi", label:"Facebook",  Ico: FbIcon },
                { href:"https://www.youtube.com/diocesedekabgayi",  label:"YouTube",   Ico: YtIcon },
                { href:"https://twitter.com/diocesekabgayi",        label:"Twitter",   Ico: TwIcon },
                { href:"https://www.instagram.com/diocesedekabgayi",label:"Instagram", Ico: IgIcon },
              ].map(({ href, label, Ico }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-v2-social" aria-label={label}>
                  <Ico />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav className="footer-v2-col">
            <h4 className="footer-v2-col-title">{lang === "fr" ? "Autres liens" : lang === "en" ? "OTHER LINKS" : "IBIBUZWA VUBA"}</h4>
            <ul className="footer-v2-links">
  <li>
    <a href="https://www.eglisecatholiquerwanda.org" target="_blank" rel="noopener noreferrer">
      {lang === "fr" ? "CEPR" : lang === "en" ? "CEPR" : "CEPR"}
    </a>
  </li>
  <li>
    <a href="https://aceaceglise.net" target="_blank" rel="noopener noreferrer">
      {lang === "fr" ? "ACEAC" : lang === "en" ? "ACEAC" : "ACEAC"}
    </a>
  </li>
  <li>
    <a href="https://secam.org" target="_blank" rel="noopener noreferrer">
      {lang === "fr" ? "SECAM/SCEAM" : lang === "en" ? "SECAM/SCEAM" : "SECAM/SCEAM"}
    </a>
  </li>
  <li>
    <a href="https://vatican.va" target="_blank" rel="noopener noreferrer">
      {lang === "fr" ? "Vatican" : lang === "en" ? "Vatican" : "Vatican"}
    </a>
  </li>
  {/* <li><Link to="/pastorale">{lang === "fr" ? "Pastorale" : lang === "en" ? "Pastoral" : "Pastoral"}</Link></li> */}
</ul>
          </nav>

          {/* Parishes */}
          <nav className="footer-v2-col">
            <h4 className="footer-v2-col-title">{lang === "fr" ? "LIENS RAPIDES" : lang === "en" ? "QUICK LINKS" : "AHANYURWA VUBA"}</h4>
            <ul className="footer-v2-links">
              <li><Link to="/paroisses">{lang === "fr" ? "Paroisses" : "Parishes"}</Link></li>
              <li><Link to="/paroisses">{lang === "fr" ? "Mouvements" : "Movements"}</Link></li>
              <li><Link to="">{lang === "fr" ? "Services diocésains" : "Diocesan services"}</Link></li>
              <li><Link to="">{lang === "fr" ? "Vie consacrée" : "Consecrated life"}</Link></li>
              <li><Link to="">{lang === "fr" ? "Écoles catholiques" : "Catholic schools"}</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="footer-v2-col">
            <h4 className="footer-v2-col-title">{lang === "fr" ? "Nos Coordonnées" : "CONTACT"}</h4>
            <ul className="footer-v2-contact">
              <li><MapPin  size={14} style={{flexShrink:0,color:"var(--gold)",marginTop:2}}/> BP 66 Kabgayi – Rwanda</li>
              {/* <li><Phone   size={14} style={{flexShrink:0,color:"var(--gold)",marginTop:2}}/><a href="tel:+250786535173"> 0788877848</a></li> */}
              <li><Mail    size={14} style={{flexShrink:0,color:"var(--gold)",marginTop:2}}/><a href="mailto:dkabgayi@gmail.com ">dkabgayi@gmail.com </a></li>
              <li><Globe   size={14} style={{flexShrink:0,color:"var(--gold)",marginTop:2}}/><a href="https://www.diocesekabgayi.rw" target="_blank" rel="noopener noreferrer">www.diocesekabgayi.rw</a></li>
              {/* <li><Clock   size={14} style={{flexShrink:0,color:"var(--gold)",marginTop:2}}/>Lun – Ven : 8h00 – 17h00</li> */}
            </ul>
          </address>

          {/* Location map */}
          <div className="footer-v2-col footer-v2-map-col">
            <h4 className="footer-v2-col-title">LOCALISATION</h4>
            <div className="footer-v2-map">
              <iframe
                title="Localisation Kabgayi, Rwanda"
                src="https://www.google.com/maps?q=Kabgayi,%20Rwanda&z=13&output=embed"
                width="100%"
                height="180"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
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
