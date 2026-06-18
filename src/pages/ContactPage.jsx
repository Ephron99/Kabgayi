import { useState } from "react";
import { useLang } from "../context/LanguageContext";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const labels = {
    fr: { title: "Contactez-nous", subtitle: "Nous sommes à votre écoute", name: "Nom complet", email: "Adresse email", subject: "Sujet", message: "Message", send: "Envoyer le message", success: "Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.", required: "Champ requis" },
    en: { title: "Contact Us", subtitle: "We are here to listen", name: "Full name", email: "Email address", subject: "Subject", message: "Message", send: "Send message", success: "Message sent successfully! We will reply as soon as possible.", required: "Required field" },
    rw: { title: "Twunganire", subtitle: "Turi hano kumva", name: "Amazina yuzuye", email: "Imeyili", subject: "Inyito", message: "Ubutumwa", send: "Ohereza ubutumwa", success: "Ubutumwa bwoherejwe! Tuzagusubiza vuba.", required: "Ngombwa" },
  };
  const l = labels[lang] || labels.fr;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <main id="main-content">
      <div className="page-hero" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1543652437-15ae418551d7?w=1600&q=80)" }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{t("page_contact")}</div>
          <h1>{l.title}</h1>
          <p>{l.subtitle}</p>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">{t("nav_home")}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{l.title}</span>
      </nav>

      <div className="page-content">
        <div className="contact-layout">
          {/* Info */}
          <aside className="contact-info">
            <h2>{lang === "fr" ? "Nos Coordonnées" : lang === "en" ? "Our Contact Details" : "Amakuru Yacu"}</h2>
            <div className="section-divider" aria-hidden="true"></div>

            <ul className="contact-info-list">
              <li>
                <div className="contact-info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <div>
                  <strong>{lang === "fr" ? "Adresse" : lang === "en" ? "Address" : "Aderesi"}</strong>
                  <span>{t("contact_address")}</span>
                </div>
              </li>
              <li>
                <div className="contact-info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <strong>{lang === "fr" ? "Téléphone" : "Phone"}</strong>
                  <a href={`tel:${t("contact_phone").replace(/\s/g,"")}`}>{t("contact_phone")}</a>
                </div>
              </li>
              <li>
                <div className="contact-info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${t("contact_email")}`}>{t("contact_email")}</a>
                </div>
              </li>
              <li>
                <div className="contact-info-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <div>
                  <strong>Web</strong>
                  <a href={`https://${t("contact_web")}`} target="_blank" rel="noopener noreferrer">{t("contact_web")}</a>
                </div>
              </li>
            </ul>

            {/* Office hours */}
            <div className="contact-hours">
              <h3>{lang === "fr" ? "Heures d'ouverture" : lang === "en" ? "Office Hours" : "Amasaha Afunguye"}</h3>
              <p>{lang === "fr" ? "Lundi – Vendredi : 8h00 – 17h00" : lang === "en" ? "Monday – Friday: 8:00 AM – 5:00 PM" : "Kuwa Mbere – Kuwa Gatanu: 8h00 – 17h00"}</p>
              <p>{lang === "fr" ? "Samedi : 8h00 – 12h00" : lang === "en" ? "Saturday: 8:00 AM – 12:00 PM" : "Kuwa Gatandatu: 8h00 – 12h00"}</p>
            </div>
          </aside>

          {/* Form */}
          <div className="contact-form-wrap">
            {sent ? (
              <div className="contact-success" role="alert">
                <div className="contact-success-icon" aria-hidden="true">✓</div>
                <p>{l.success}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{l.name} <span className="required" aria-label={l.required}>*</span></label>
                    <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder={l.name} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{l.email} <span className="required" aria-label={l.required}>*</span></label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder={l.email} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">{l.subject} <span className="required" aria-label={l.required}>*</span></label>
                  <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} required placeholder={l.subject} />
                </div>
                <div className="form-group">
                  <label htmlFor="message">{l.message} <span className="required" aria-label={l.required}>*</span></label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder={l.message} rows={6}></textarea>
                </div>
                <button type="submit" className="btn btn--primary btn--full">{l.send}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
