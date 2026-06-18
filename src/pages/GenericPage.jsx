import { useParams, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { Link } from "react-router-dom";

const pageData = {
  services: {
    hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
    titleKey: "page_services",
    navKey: "nav_services",
    items: [
      { slug: "economat", key: "sub_economat", icon: "📊", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80", desc: { fr: "L'Économat Général assure la gestion financière et administrative du Diocèse de Kabgayi dans la transparence et selon les normes de l'Église catholique.", en: "The General Bursar ensures the financial and administrative management of the Diocese of Kabgayi with transparency and according to the norms of the Catholic Church.", rw: "Ubukungu Rusange bugenzura imicungire y'imari no gutunga kwa Diyosezi ya Kabgayi mu bucuruzi no mu mategeko y'Itorero Gatolika." } },
      { slug: "caritas", key: "sub_caritas", icon: "❤️", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", desc: { fr: "Caritas Kabgayi est l'organisation caritative du diocèse qui oeuvre pour le développement humain intégral et la lutte contre la pauvreté.", en: "Caritas Kabgayi is the charitable organization of the diocese working for integral human development and the fight against poverty.", rw: "Caritas Kabgayi ni umuryango w'imfashanyo wa diyosezi ukorera mu gutera imbere abantu wose no kurwanya ubukene." } },
      { slug: "education", key: "sub_education", icon: "🎓", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", desc: { fr: "La Direction diocésaine de l'Éducation Catholique supervise un réseau d'écoles et assure la formation chrétienne à travers la catéchèse.", en: "The Diocesan Directorate of Catholic Education supervises a network of schools and ensures Christian formation through catechesis.", rw: "Ubuyobozi bw'Uburezi Gatolika bwa Diyosezi bugenzura amashuri menshi kandi bufasha guha inyigisho z'ubukristu." } },
      { slug: "hopital", key: "sub_hopital", icon: "🏥", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80", desc: { fr: "L'Hôpital de Kabgayi est l'une des structures sanitaires les plus importantes de la région, offrant des soins de qualité à tous.", en: "Kabgayi Hospital is one of the most important health facilities in the region, offering quality care to all.", rw: "Ibitaro bya Kabgayi ni kimwe mu bikorwa by'ubuvuzi byo mu karere, bitanga ubuvuzi bwiza ku bantu bose." } },
      { slug: "hotel-saint-andre", key: "sub_hotel", icon: "🏨", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", desc: { fr: "L'Hôtel Saint-André offre un accueil de qualité dans un cadre paisible propice à la réflexion et à la spiritualité.", en: "Hotel Saint-André offers quality accommodation in a peaceful setting conducive to reflection and spirituality.", rw: "Hoteli Saint-André itanga ituwe ryiza mu mwirondoro uhuza no gufatanya no gusengera." } },
      { slug: "imprimerie", key: "sub_imprimerie", icon: "🖨️", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", desc: { fr: "L'Imprimerie de Kabgayi est un centre d'excellence dans l'édition et l'impression, au service de l'Église et de la société.", en: "Kabgayi Print House is a center of excellence in publishing and printing, serving the Church and society.", rw: "Inzego z'Ibyapa bya Kabgayi ni ibigo by'intangarugero mu gusohora n'gutandika, bikora Itorero n'umuryango." } },
      { slug: "centres-spiritualite", key: "sub_centres", icon: "🙏", img: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=600&q=80", desc: { fr: "Les Centres de Spiritualité proposent des retraites, des sessions de formation et des temps de prière pour les fidèles.", en: "The Spirituality Centers offer retreats, training sessions and prayer times for the faithful.", rw: "Ibigo bya Spiritualité bitanga amahugurwa, inyigisho n'amasengero ku bakristu." } },
      { slug: "institut-catholique", key: "sub_institut", icon: "🏛️", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", desc: { fr: "L'Institut Catholique de Kabgayi est un établissement d'enseignement supérieur qui forme des professionnels compétents et engagés.", en: "The Catholic Institute of Kabgayi is a higher education institution that trains competent and committed professionals.", rw: "Inshuri Gatolika ya Kabgayi ni ishuri ry'amashuri makuru rihugura inzobere n'abantu bitegure inshingano." } },
    ],
  },
  pastorale: {
    hero: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=80",
    titleKey: "nav_pastorale",
    navKey: "nav_pastorale",
    items: [
      { slug: "priorites", key: "sub_priorites", icon: "🎯", img: "https://images.unsplash.com/photo-1545050073-c2d4693c3c16?w=600&q=80", desc: { fr: "Les priorités pastorales du Diocèse définissent les grandes orientations de l'action évangélisatrice pour les années à venir.", en: "The pastoral priorities of the Diocese define the main orientations of evangelizing action for the coming years.", rw: "Ibintu by'ingenzi bya pastoral by'Diyosezi bisobanura inzira z'ingenzi z'intangiriro yo gutangaza Ubutumwa." } },
      { slug: "commissions", key: "sub_commissions", icon: "⚙️", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80", desc: { fr: "Les commissions diocésaines travaillent dans différents domaines pour accompagner les fidèles et animer la vie de l'Église.", en: "The diocesan commissions work in different areas to accompany the faithful and animate the life of the Church.", rw: "Komisiyo za Diyosezi zikorera mu nzego zitandukanye gutuza abakristu no gutera imbere ubuzima bw'Itorero." } },
      { slug: "aumoneries", key: "sub_aumoneries", icon: "✝️", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80", desc: { fr: "Les aumôneries assurent un accompagnement spirituel dans les hôpitaux, les écoles, l'armée et les milieux professionnels.", en: "The chaplaincies provide spiritual accompaniment in hospitals, schools, the army and professional environments.", rw: "Abapadiri b'Ubutumwa bafasha mu bibitaro, amashuri, ingabo no mu bikorwa by'umwuga." } },
    ],
  },
  documentation: {
    hero: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80",
    titleKey: "page_documentation",
    navKey: "nav_documentation",
    items: [
      { slug: "homelies", key: "sub_homelies", icon: "📖", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", desc: { fr: "Retrouvez les homélies de notre Évêque et des prêtres du diocèse pour vous nourrir de la Parole de Dieu.", en: "Find the homilies of our Bishop and the priests of the diocese to nourish yourself with the Word of God.", rw: "Shaka insiguro z'Umusenyeri wacu n'abapadiri ba diyosezi kugira ngo ufashe ijambo ry'Imana." } },
      { slug: "mwigisha", key: "sub_mwigisha", icon: "📚", img: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=600&q=80", desc: { fr: "Mwigisha est la revue catéchétique du Diocèse de Kabgayi, un outil précieux pour la formation des catéchistes.", en: "Mwigisha is the catechetical review of the Diocese of Kabgayi, a valuable tool for the training of catechists.", rw: "Mwigisha ni ikinyamakuru cy'inyigisho za Diyosezi ya Kabgayi, igikoresho cy'agaciro mu guha inyigisho abakatekisiti." } },
      { slug: "urumuri", key: "sub_urumuri", icon: "💡", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", desc: { fr: "Urumuri Rwa Kristu — La Lumière du Christ — est la publication diocésaine qui partage les nouvelles de l'Église et de la foi.", en: "Urumuri Rwa Kristu — The Light of Christ — is the diocesan publication sharing news of the Church and faith.", rw: "Urumuri Rwa Kristu ni gaseti ya diyosezi isangira amakuru y'Itorero n'ukwizera." } },
      { slug: "nouvelles", key: "sub_nouvelles", icon: "📰", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80", desc: { fr: "Les Nouvelles du Diocèse de Kabgayi vous tiennent informés des activités, événements et annonces du diocèse.", en: "The News of the Diocese of Kabgayi keeps you informed of activities, events and announcements from the diocese.", rw: "Amakuru ya Diyosezi ya Kabgayi akumenyesha ibikorwa, ibirori n'itangazo rya diyosezi." } },
    ],
  },
  liturgie: {
    hero: "https://images.unsplash.com/photo-1545050073-c2d4693c3c16?w=1600&q=80",
    titleKey: "nav_accueil_liturgique",
    navKey: "nav_accueil_liturgique",
    items: [
      { slug: "jour", key: "sub_liturgie", icon: "📅", img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80", desc: { fr: "Retrouvez chaque jour les lectures, le psaume et l'évangile de la liturgie catholique pour nourrir votre prière quotidienne.", en: "Find each day the readings, psalm and gospel of the Catholic liturgy to nourish your daily prayer.", rw: "Buri munsi shaka amasomero, indirimbo ya Zaburi n'Ubutumwa Bwiza bw'ibadiho Gatolika kugira ngo ufashe gusenga buri munsi." } },
      { slug: "videos", key: "sub_videos", icon: "🎬", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", desc: { fr: "Regardez les messes, célébrations, conférences et événements du Diocèse de Kabgayi en vidéo.", en: "Watch Masses, celebrations, conferences and events from the Diocese of Kabgayi on video.", rw: "Reba amisa, ibirori, inama n'ibikorwa bya Diyosezi ya Kabgayi mu mashusho." } },
    ],
  },
};

export default function GenericPage({ section }) {
  const { t, lang } = useLang();
  const { slug } = useParams();
  const data = pageData[section];

  if (!data) return <div className="page-content"><p>Page not found</p></div>;

  // Detail view
  if (slug) {
    const item = data.items.find((i) => i.slug === slug);
    if (!item) return <div className="page-content"><p>Not found</p></div>;
    return (
      <main id="main-content">
        <div className="page-hero" style={{ backgroundImage: `url(${item.img})` }}>
          <div className="page-hero-overlay" aria-hidden="true"></div>
          <div className="page-hero-content">
            <div className="section-label">{t(data.navKey)}</div>
            <h1>{t(item.key)}</h1>
          </div>
        </div>
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">{t("nav_home")}</Link>
          <span aria-hidden="true"> / </span>
          <Link to={`/${section}`}>{t(data.titleKey)}</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{t(item.key)}</span>
        </nav>
        <div className="page-content">
          <div className="detail-layout">
            <img src={item.img} alt={t(item.key)} className="detail-img" loading="lazy" />
            <div className="detail-text">
              <h2>{t(item.key)}</h2>
              <div className="section-divider" aria-hidden="true"></div>
              <p>{item.desc[lang] || item.desc.fr}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // List view
  return (
    <main id="main-content">
      <div className="page-hero" style={{ backgroundImage: `url(${data.hero})` }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{t(data.navKey)}</div>
          <h1>{t(data.titleKey)}</h1>
        </div>
      </div>
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">{t("nav_home")}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{t(data.titleKey)}</span>
      </nav>
      <div className="page-content">
        <div className="services-grid">
          {data.items.map((item) => (
            <Link key={item.slug} to={`/${section}/${item.slug}`} className="service-card">
              <div className="service-card-img-wrap">
                <img src={item.img} alt={t(item.key)} className="service-card-img" loading="lazy" />
                <div className="service-card-icon" aria-hidden="true">{item.icon}</div>
              </div>
              <div className="service-card-body">
                <h3>{t(item.key)}</h3>
                <p>{(item.desc[lang] || item.desc.fr).substring(0, 100)}…</p>
                <span className="service-card-link">{lang === "fr" ? "En savoir plus" : lang === "en" ? "Learn more" : "Soma ibindi"} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
