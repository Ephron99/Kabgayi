import { useLang } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const content = {
  fr: {
    title: "Vie Consacrée",
    subtitle: "Les religieux et religieuses au cœur de la mission diocésaine",
    intro: "Le Diocèse de Kabgayi accueille de nombreuses congrégations religieuses qui participent activement à la mission de l'Église à travers l'éducation, la santé, la pastorale et le témoignage de la vie consacrée.",
    orders: [
      { name: "Sœurs de Notre-Dame d'Afrique", charism: "Éducation et développement", since: "Depuis 1903" },
      { name: "Frères Maristes", charism: "Éducation chrétienne", since: "Depuis 1956" },
      { name: "Petites Sœurs de Jésus", charism: "Présence contemplative", since: "Depuis 1982" },
      { name: "Bénédictines de Butare", charism: "Vie monastique et liturgie", since: "Depuis 1907" },
    ],
  },
  en: {
    title: "Consecrated Life",
    subtitle: "Religious men and women at the heart of the diocesan mission",
    intro: "The Diocese of Kabgayi welcomes many religious congregations that actively participate in the Church's mission through education, health, pastoral work and the witness of consecrated life.",
    orders: [
      { name: "Sisters of Our Lady of Africa", charism: "Education and development", since: "Since 1903" },
      { name: "Marist Brothers", charism: "Christian education", since: "Since 1956" },
      { name: "Little Sisters of Jesus", charism: "Contemplative presence", since: "Since 1982" },
      { name: "Benedictines of Butare", charism: "Monastic life and liturgy", since: "Since 1907" },
    ],
  },
  rw: {
    title: "Ubuzima Bwejejwe",
    subtitle: "Abazima b'Imana mu mutima w'inshingano ya diyosezi",
    intro: "Diyosezi ya Kabgayi yakira amatsinda menshi y'abazima b'Imana bafatanya mu nshingano y'Itorero binyuze mu burezi, ubuvuzi, pastoral n'ubuhamya bw'ubuzima bwejejwe.",
    orders: [
      { name: "Inzirakarengane za Notre-Dame d'Afrique", charism: "Uburezi no gutera imbere", since: "Kuva 1903" },
      { name: "Abafrere ba Mariste", charism: "Uburezi bwa Gatolika", since: "Kuva 1956" },
      { name: "Inzirakarengane nto za Yezu", charism: "Kubaho mu gusenga", since: "Kuva 1982" },
      { name: "Benedikitini za Butare", charism: "Ubuzima bw'ubusugire n'ibadiho", since: "Kuva 1907" },
    ],
  },
};

export default function VieConsacreePage() {
  const { t, lang } = useLang();
  const c = content[lang] || content.fr;

  return (
    <main id="main-content">
      <div className="page-hero" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=80)" }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <h1>{c.title}</h1>
          <p>{c.subtitle}</p>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">{t("nav_home")}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{c.title}</span>
      </nav>

      <div className="page-content">
        <div className="vie-intro">
          <div className="vie-intro-cross" aria-hidden="true">✝</div>
          <p>{c.intro}</p>
        </div>

        <h2 className="vie-subtitle">
          {lang === "fr" ? "Congrégations Religieuses" : lang === "en" ? "Religious Congregations" : "Amatsinda y'Abazima b'Imana"}
        </h2>
        <div className="section-divider" aria-hidden="true"></div>

        <div className="orders-grid">
          {c.orders.map((order, i) => (
            <div key={i} className="order-card">
              <div className="order-card-icon" aria-hidden="true">✝</div>
              <h3>{order.name}</h3>
              <p className="order-charism">{order.charism}</p>
              <span className="order-since">{order.since}</span>
            </div>
          ))}
        </div>

        <div className="vie-quote">
          <blockquote>
            {lang === "fr"
              ? "«La vie consacrée est un signe prophétique pour le monde et un don précieux pour l'Église.»"
              : lang === "en"
              ? "\"Consecrated life is a prophetic sign for the world and a precious gift for the Church.\""
              : "\"Ubuzima bwejejwe ni ikimenyetso cy'ubuhanuzi ku isi kandi impano y'agaciro ku Itorero.\""}
            <cite>— {lang === "fr" ? "Pape Jean-Paul II" : "Pope John Paul II"}</cite>
          </blockquote>
        </div>
      </div>
    </main>
  );
}
