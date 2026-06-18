import { useLang } from "../context/LanguageContext";

const values = [
  {
    titleKey: "val1_title",
    descKey: "val1_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
  {
    titleKey: "val2_title",
    descKey: "val2_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    titleKey: "val3_title",
    descKey: "val3_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    titleKey: "val4_title",
    descKey: "val4_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function ValuesSection() {
  const { t } = useLang();

  return (
    <section className="values-section" aria-labelledby="values-heading">
      <div className="section-inner">
        <div className="section-label">{t("values_title")}</div>
        <h2 id="values-heading" className="section-title">{t("values_title")}</h2>
        <div className="section-divider" aria-hidden="true"></div>

        <div className="values-grid">
          {values.map((v) => (
            <div key={v.titleKey} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3 className="value-title">{t(v.titleKey)}</h3>
              <p className="value-desc">{t(v.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
