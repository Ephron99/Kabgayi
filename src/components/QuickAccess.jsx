import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { Church, GraduationCap, Heart, CalendarDays, FileText, Radio, Users } from "lucide-react";

export default function QuickAccess() {
  const { lang } = useLang();

  const items = [
    {
      Icon: Church,
      labelFr: "Paroisses",
      labelEn: "Parishes",
      labelRw: "Paruwasi",
      to: "/paroisses",
    },
    {
      Icon: GraduationCap,
      labelFr: "Écoles catholiques",
      labelEn: "Catholic schools",
      labelRw: "Amashuri Gatolika",
      to: "",
    },
    {
      Icon: Heart,
      labelFr: "Œuvres sociales",
      labelEn: "Social works",
      labelRw: "Ibikorwa by'imibereho",
      to: "",
    },
    {
      Icon: CalendarDays,
      labelFr: "AGENDA PASTORAL 2026/2027",
      labelEn: "Pastoral agenda",
      labelRw: "Gahunda y'ubutumwa",
      to: "",
    },
    {
      Icon: FileText,
      labelFr: "Documents officiels",
      labelEn: "Official documents",
      labelRw: "Inyandiko zihariye",
      to: "",
    },
    {
      Icon: Radio,
      labelFr: "Messes & Liturgies",
      labelEn: "Masses & Liturgies",
      labelRw: "Imisa n'Ibadiho",
      to: "/liturgie/horaires-messes",
    },
    {
      Icon: Users,
      labelFr: "Vocations",
      labelEn: "Vocations",
      labelRw: "Inzira",
      to: "",
    },
  ];

  const getLabel = (item) =>
    lang === "en" ? item.labelEn : lang === "rw" ? item.labelRw : item.labelFr;

  return (
    <section className="quick-access-section" aria-labelledby="qa-heading">
      <div className="quick-access-inner">
        <div className="quick-access-header">
          <h2 id="qa-heading" className="quick-access-title">
            {lang === "fr" ? "ACCÈS RAPIDES" : lang === "en" ? "QUICK ACCESS" : "IBIBUZWA VUBA"}
          </h2>
          <div className="quick-access-line" aria-hidden="true" />
        </div>

        <div className="quick-access-grid">
          {items.map((item) => (
            <Link key={item.labelFr} to={item.to} className="qa-card">
              <div className="qa-card-icon">
                <item.Icon size={36} strokeWidth={1.5} />
              </div>
              <span className="qa-card-label">{getLabel(item)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
