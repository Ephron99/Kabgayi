import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function CTASection() {
  const { t } = useLang();

  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-inner">
        <div className="cta-cross" aria-hidden="true">✝</div>
        <h2 id="cta-heading" className="cta-title">{t("cta_title")}</h2>
        <p className="cta-subtitle">{t("cta_subtitle")}</p>
        <div className="cta-actions">
          <Link to="/contact" className="btn btn--white">
            {t("cta_btn1")}
          </Link>
          <Link to="#donate" className="btn btn--gold">
            {t("cta_btn2")}
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
