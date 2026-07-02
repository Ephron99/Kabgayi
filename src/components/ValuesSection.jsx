import { useLang } from "../context/LanguageContext";
import { Star, Users, Globe, Heart } from "lucide-react";

const values = [
  { titleKey: "val1_title", descKey: "val1_desc", Icon: Star },
  { titleKey: "val2_title", descKey: "val2_desc", Icon: Users },
  { titleKey: "val3_title", descKey: "val3_desc", Icon: Globe },
  { titleKey: "val4_title", descKey: "val4_desc", Icon: Heart },
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
              <div className="value-icon"><v.Icon size={38} strokeWidth={1.5} /></div>
              <h3 className="value-title">{t(v.titleKey)}</h3>
              <p className="value-desc">{t(v.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
