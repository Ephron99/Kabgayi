import { useParams, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import ick from "../assets/ICK.jpeg";
import kabgayi from "../assets/kabgayi.jpg";
import caritas from "../assets/caritas.jpg";
import kabgayi_h from "../assets/kabgayi_h.jpg";
import hotel from "../assets/hotel.jpg";
import print from "../assets/print.jpg";
import elizabeth from "../assets/elizabeth.jpg";
import {
  BarChart3, Heart, GraduationCap, Hospital, Hotel, Printer,
  HandHeart, Landmark, Target, Settings, Cross, School,
  BookOpen, Book, Lightbulb, Newspaper, Calendar, Video, Church
} from "lucide-react";


const pageData = {
  services: {
    hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
    titleKey: "page_services",
    navKey: "nav_services",
    items: [
      { slug: "economat", key: "sub_economat", icon: <BarChart3 />, img: kabgayi, desc: { fr: "L'Économat Général assure la gestion financière et administrative du Diocèse de Kabgayi dans la transparence et selon les normes de l'Église catholique. Il gère les budgets, les comptes, les biens du diocèse et assure la bonne administration des ressources pour soutenir la mission évangélisatrice et les œuvres caritatives.", en: "The General Bursar ensures the financial and administrative management of the Diocese of Kabgayi with transparency and according to the norms of the Catholic Church. It manages budgets, accounts, diocesan assets and ensures the proper administration of resources to support the evangelizing mission and charitable works.", rw: "Ubukungu Rusange bugenzura imicungire y'imari no gutunga kwa Diyosezi ya Kabgayi mu bucuruzi no mu mategeko y'Itorero Gatolika. Bugenzura ibije, amakonti, ibintu bya diyosezi kandi bugenzura neza ingufu zo kugira ngo zigere inshingano yo gutangaza Ubutumwa n'ibikorwa by'umutima." } },
      { slug: "caritas", key: "sub_caritas", icon: <Heart />, img: caritas, desc: { fr: `1. Définition et Historique 
Caritas est un mot latin qui signifie Charité. La charité qui nous a été enseignée par Jésus Christ. C’est la mise en pratique de la loi de l’amour suivant son précepte : « Aimez-vous les uns les autres comme je vous ai aimé » (Jn15, 12) 
La Caritas constitue l’instrument de la mise en œuvre de la pastorale sociale de l’église Catholique pour le témoignage et l’exercice de la charité. C’est une manière organisée d’exercer le service de la charité et de la justice pour le salut et la promotion de tout homme. 

Au niveau mondial 
La première organisation Caritas est née à Freiburg, en Allemagne, en1897. Ensuite, d’autres organisations nationales de Caritas furent créées en Suisse (1901), en Autriche (1903), aux Etats-Unis (1910) et aux Pays bas (1924). 
Ces organisations ont aussitôt ressenti l’exigence de travailler en synergie car, en 1924, les Caritas européennes se sont organisées, sous le nom de Caritas Internationales. En 1950, une nouvelle fondation vit le jour sous le nom de « Fédération Internationale des charités catholiques ». En 1957, le 10ème comité Exécutif opta pour un nom plus simple, celui de Caritas Internationale (CI). Par cette décision, la Caritas Internationale fondée en 1924, à un niveau uniquement européen, cessa d’exister. 
Actuellement, Caritas Internationale est une confédération de 162 organisations catholiques d’aide, de développement et de service social travaillant pour construire un monde meilleur, spécialement en faveur des pauvres et des opprimés dans plus de 200 pays et territoires. 
Mais depuis 1970, les membres d’une même région géographique se sont organisés en Conférence régionale, et c’est dans ce cadre qu’il y a la Caritas pour la Région d’Afrique, regroupant au tour de 45 organisations membres présents dans 45 pays (dont le Rwanda) sur les 54 du continent africain, avec une subdivision en 7 coordinations zonales correspondant actuellement à 7 des 9 conférences Episcopales sous-régionales. 

Au niveau national 
L’historique de la Caritas au Rwanda remonte dans les années 1960 dans le Diocèse de Kabgayi avec Monseigneur André Parraudin qui était Evêque de ce Diocèse. C’était dans les événements troublants que le pays a connus de 1959 jusqu’en 1963. En effet, ces événements ont poussé l’Eglise Catholique (représentée à cette époque par 3 Evêques) à créer en 1960 une institution appelée à l’époque le « Secours Catholique Rwandais » (SCR). Son objectif était de venir en aide aux populations victimes du changement politique intervenu dans le pays et d’être attentifs à tous ceux qui étaient opprimés par la maladie et la pauvreté. En 1963, le « Secours Catholique Rwandais » est devenu la « Caritas Rwanda », agréée par l’Etat comme une association sans but lucratif. La Caritas Rwanda a été admise comme membre de la Caritas Internationale en 1965 lors de son assemblée générale tenue à Rome du 7 au 10 septembre 1965. 
A l’époque, les interventions de développement de l’Eglise Catholique étaient exécutées sous le nom de Caritas du Développement. Mais comme certains organismes refusaient de lui accorder l’aide, considérant que c’était une œuvre purement caritative, les Evêques décidèrent de séparer le service de développement de la Caritas. C’est ainsi que le 7 décembre 1968, les Evêques du Rwanda ont approuvé la création d’un Bureau de Recherche et d’Animation du Développement au Rwanda (BRADRWA). Par la suite, on s’est rendu compte que cette appellation faisait penser plus à un service public, avec des risques de lui donner un rôle qui n’était pas le sien. Pour éviter cette confusion, l’appellation de BRADRWA fut changée en Bureau Episcopal de Développement (BED). Institué par les Evêques en 1972, ce n’est qu’à partir de 1976 que le BED prit pleinement son rôle national. Dans la période de l’après-guerre, vers les années 1997-1998, le BED est devenu le département de développement au sein de la Caritas. 

1. Dénomination, objet, siège social, zone d’activités 
1.1 Dénomination officielle 
Le service d’action socio pastorale et caritative du Diocèse Catholique de Kabgayi est dénommée : « CARITAS DIOCESAINE DE KABGAYI ». Son statut juridique est lié à celui du Diocèse de Kabgayi A.S.B.L, du 15/10/1962, mais elle dispose d’une autonomie de gestion. 

1.2 Objet 
Caritas a pour objet de promouvoir la dignité humaine. Ses activités consistent à secourir les personnes qui se trouvent en situation de détresse en leur venant en aide pour leurs besoins indispensables et en favorisant leur promotion sociale et leur autonomie. C’est une structure officielle, une organisation qui permet d’exercer la charité, la solidarité, le partage, l’accueil et le service à la communauté. Comme structure, Caritas cherche à stimuler et à organiser la solidarité dans la communauté en vue de la justice et de la charité.`, en: "Caritas Kabgayi is the charitable organization of the diocese working for integral human development and the fight against poverty.", rw: "Caritas Kabgayi ni umuryango w'imfashanyo wa diyosezi ukorera mu gutera imbere abantu wose no kurwanya ubukene." } },
      { slug: "education", key: "sub_education", icon: <GraduationCap />, img: ick, sectionLink: "/education", desc: { fr: "ICK – Institut Catholique de Kabgayi, Institut Ste Elizabeth Kabgayi, Grand Séminaire Kabgayi, Écoles Catholiques privées, Écoles Catholiques Conventionnées.", en: "ICK – Institut Catholique de Kabgayi, Institut Ste Elizabeth Kabgayi, Grand Séminaire Kabgayi, private Catholic Schools, State-partnered Catholic Schools.", rw: "ICK – Inshuri Gatolika ya Kabgayi, Inshuri Ste Elizabeth Kabgayi, Grand Séminaire Kabgayi, Amashuri Gatolika y'abikorera, Amashuri Gatolika y'amasezerano." } },
      { slug: "hopital", key: "sub_hopital", icon: <Hospital />, img: kabgayi_h, desc: { fr: `L’Hôpital de Kabgayi est un hôpital libre subsidié du Diocèse de Kabgayi, administrativement localisé au Province du Sud, District de Muhanga, Secteur Nyamabuye ; à Kabgayi : tout au long de la route HUYE-KIGALI. 

L’Hôpital de Kabgayi a été inauguré le 9 septembre 1937. Il a une capacité de 372 lits, il compte 14 Services ; 9 Unités et serve une population de ± 700.000 habitants. Il est responsable de 16 Centres de Santé (Kabgayi, Shyogwe, Gitarama, Kivumu, Nyarusange, Mushishiro, Gikomero, Rugendabari, Gasovu, Buramba, Nyabinoni, Nyabikenke, Gasagara, Gitega, Rutobwe, Mata) et le dispensaire de la Prison Centrale de Muhanga. 

Il dessert aussi par transfert 5 Centres de Santé du District de Ruhango (Ruhango, Byimana, Kizibere, Mbuye et Gishweru) et 2 Centres de Santé du District de Kamonyi (Musambira et Nyamiyaga). 

A PROPOS DE NOUS 

MISSION 
Améliorer la santé de la population à travers la dispensation des services de qualité du paquet complémentaire d’activités, tout en assurant l’encadrement des centres de santé de notre zone de rayonnement. 

VISION 
Garantir et promouvoir l’état de santé de la population rwandaise en offrant des services de qualité en matière de prévention, de réhabilitation et de médecine curative au sein d’un système de santé efficace. 

VALEURS 
Hospitalité - Qualité - Professionnalisme`, en: "Kabgayi Hospital is one of the most important health facilities in the region, offering quality care to all.", rw: "Ibitaro bya Kabgayi ni kimwe mu bikorwa by'ubuvuzi byo mu karere, bitanga ubuvuzi bwiza ku bantu bose." } },
      { slug: "hotel-saint-andre", key: "sub_hotel", icon: <Hotel />, img: hotel, desc: { fr: "L'Hôtel Saint-André offre un accueil de qualité dans un cadre paisible propice à la réflexion et à la spiritualité.", en: "Hotel Saint-André offers quality accommodation in a peaceful setting conducive to reflection and spirituality.", rw: "Hoteli Saint-André itanga ituwe ryiza mu mwirondoro uhuza no gufatanya no gusengera." } },
      { slug: "imprimerie", key: "sub_imprimerie", icon: <Printer />, img: print, desc: { fr: "L'Imprimerie de Kabgayi est un centre d'excellence dans l'édition et l'impression, au service de l'Église et de la société.", en: "Kabgayi Print House is a center of excellence in publishing and printing, serving the Church and society.", rw: "Inzego z'Ibyapa bya Kabgayi ni ibigo by'intangarugero mu gusohora n'gutandika, bikora Itorero n'umuryango." } },
      { slug: "centres-spiritualite", key: "sub_centres", icon: <HandHeart />, img: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=600&q=80", desc: { fr: "Les Centres de Spiritualité proposent des retraites, des sessions de formation et des temps de prière pour les fidèles.", en: "The Spirituality Centers offer retreats, training sessions and prayer times for the faithful.", rw: "Ibigo bya Spiritualité bitanga amahugurwa, inyigisho n'amasengero ku bakristu." } },
      { slug: "institut-catholique", key: "sub_institut", icon: <Landmark />, img: ick, desc: { fr: "L'Institut Catholique de Kabgayi a été fondé en 2002 par le Diocèse Catholique de Kabgayi sous le nom d'Université Catholique de Kabgayi (UCK). Il a été reconnu par le Ministère de l'Éducation par la Convention d'Attribution N° 001/03/2003 conclue entre le Gouvernement du Rwanda via le Ministère de l'Éducation et le Diocèse Catholique de Kabgayi. Ce qui a commencé comme Université Catholique de Kabgayi est devenu Institut Catholique de Kabgayi par l'Arrêté Ministériel N° 03/08.11 du 04/02/2010 promulgué dans le Journal Officiel de la République du Rwanda N° 08 du 22/02/2010. L'Institut a obtenu l'accréditation ou la Licence d'Exploitation Définitive par la décision du Cabinet du 24 mars 2010.", en: "The Catholic Institute of Kabgayi was founded in 2002 by the Catholic Diocese of Kabgayi under the name Université Catholique de Kabgayi (UCK). It was given recognition by the Ministry of Education by Convention of Allocation N° 001/03/2003 concluded between the Government of Rwanda via the Ministry of Education and the Catholic Diocese of Kabgayi. What started as Université Catholique de Kabgayi became Institut Catholique de Kabgayi by the Ministerial Order N° 03/08.11 of 04/02/2010 promulgated in Official Gazette of the Republic of Rwanda N° 08 of 22/02/2010. The Institute obtained accreditation or Definitive Operating Licence by the decision of the Cabinet on March 24th, 2010.", rw: "Institut Catholique de Kabgayi yasungurwa mu 2002 na Diyosezi Gatolika ya Kabgayi icyinjirwa kugira ngo izwi Université Catholique de Kabgayi (UCK). Yagishwe kumenyekwa na Minisiteri y'Uburezi hamwe na Convention d'Attribution N° 001/03/2003 yanjwe hagati ya Leta ya Rwanda ku ruhande rwa Minisiteri y'Uburezi na Diyosezi Gatolika ya Kabgayi. Ibyatangiye kuba Université Catholique de Kabgayi byahinduka Institut Catholique de Kabgayi hamwe na Arrêté Ministériel N° 03/08.11 ya 04/02/2010 yahishuwe mu Journal Officiel wa Repubulika ya Rwanda N° 08 ya 22/02/2010. Institut yagishwe uruhushwa cyangwa Licence d'Exploitation Définitive hamwe na igitekerezo cya Cabinet ku 24 werurwe 2010." } },
    ],
  },
  pastorale: {
    hero: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=80",
    titleKey: "nav_pastorale",
    navKey: "nav_pastorale",
    items: [
      { slug: "priorites", key: "sub_priorites", icon: <Target />, img: "https://images.unsplash.com/photo-1545050073-c2d4693c3c16?w=600&q=80", desc: { fr: "Les priorités pastorales du Diocèse définissent les grandes orientations de l'action évangélisatrice pour les années à venir.", en: "The pastoral priorities of the Diocese define the main orientations of evangelizing action for the coming years.", rw: "Ibintu by'ingenzi bya pastoral by'Diyosezi bisobanura inzira z'ingenzi z'intangiriro yo gutangaza Ubutumwa." } },
      { slug: "commissions", key: "sub_commissions", icon: <Settings />, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80", desc: { fr: "Les commissions diocésaines travaillent dans différents domaines pour accompagner les fidèles et animer la vie de l'Église.", en: "The diocesan commissions work in different areas to accompany the faithful and animate the life of the Church.", rw: "Komisiyo za Diyosezi zikorera mu nzego zitandukanye gutuza abakristu no gutera imbere ubuzima bw'Itorero." } },
      { slug: "aumoneries", key: "sub_aumoneries", icon: <Cross />, img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80", desc: { fr: "Les aumôneries assurent un accompagnement spirituel dans les hôpitaux, les écoles, l'armée et les milieux professionnels.", en: "The chaplaincies provide spiritual accompaniment in hospitals, schools, the army and professional environments.", rw: "Abapadiri b'Ubutumwa bafasha mu bibitaro, amashuri, ingabo no mu bikorwa by'umwuga." } },
    ],
  },
  education: {
    hero: ick,
    titleKey: "page_education",
    navKey: "nav_education",
    items: [
      { slug: "ick", key: "sub_ick", icon: <Landmark />, img: ick, desc: { fr: "L'Institut Catholique de Kabgayi a été fondé en 2002 par le Diocèse Catholique de Kabgayi sous le nom d'Université Catholique de Kabgayi (UCK). Il a été reconnu par le Ministère de l'Éducation par la Convention d'Attribution N° 001/03/2003 conclue entre le Gouvernement du Rwanda via le Ministère de l'Éducation et le Diocèse Catholique de Kabgayi. Ce qui a commencé comme Université Catholique de Kabgayi est devenu Institut Catholique de Kabgayi par l'Arrêté Ministériel N° 03/08.11 du 04/02/2010 promulgué dans le Journal Officiel de la République du Rwanda N° 08 du 22/02/2010. L'Institut a obtenu l'accréditation ou la Licence d'Exploitation Définitive par la décision du Cabinet du 24 mars 2010.", en: "The Catholic Institute of Kabgayi was founded in 2002 by the Catholic Diocese of Kabgayi under the name Université Catholique de Kabgayi (UCK). It was given recognition by the Ministry of Education by Convention of Allocation N° 001/03/2003 concluded between the Government of Rwanda via the Ministry of Education and the Catholic Diocese of Kabgayi. What started as Université Catholique de Kabgayi became Institut Catholique de Kabgayi by the Ministerial Order N° 03/08.11 of 04/02/2010 promulgated in Official Gazette of the Republic of Rwanda N° 08 of 22/02/2010. The Institute obtained accreditation or Definitive Operating Licence by the decision of the Cabinet on March 24th, 2010.", rw: "Institut Catholique de Kabgayi yasungurwa mu 2002 na Diyosezi Gatolika ya Kabgayi icyinjirwa kugira ngo izwi Université Catholique de Kabgayi (UCK). Yagishwe kumenyekwa na Minisiteri y'Uburezi hamwe na Convention d'Attribution N° 001/03/2003 yanjwe hagati ya Leta ya Rwanda ku ruhande rwa Minisiteri y'Uburezi na Diyosezi Gatolika ya Kabgayi. Ibyatangiye kuba Université Catholique de Kabgayi byahinduka Institut Catholique de Kabgayi hamwe na Arrêté Ministériel N° 03/08.11 ya 04/02/2010 yahishuwe mu Journal Officiel wa Repubulika ya Rwanda N° 08 ya 22/02/2010. Institut yagishwe uruhushwa cyangwa Licence d'Exploitation Définitive hamwe na igitekerezo cya Cabinet ku 24 werurwe 2010." } },
      { slug: "ste-elizabeth", key: "sub_ste_elizabeth", icon: <GraduationCap />, img: elizabeth, desc: { fr: "L'Institut Sainte-Elizabeth de Kabgayi forme les jeunes filles et garçons dans un esprit chrétien, avec rigueur académique et sens des valeurs.", en: "The Saint Elizabeth Institute of Kabgayi trains young men and women in a Christian spirit, with academic rigor and a sense of values.", rw: "Inshuri Ste Elizabeth ya Kabgayi ihugura urubyiruko mu buryo bwa gikristu, hifashishijwe imyigire ikomeye n'indangagaciro." } },
      { slug: "grand-seminaire", key: "sub_grand_seminaire", icon: <Church />, img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", desc: { fr: "Le Grand Séminaire de Kabgayi assure la formation philosophique, théologique et spirituelle des futurs prêtres du diocèse.", en: "The Major Seminary of Kabgayi provides the philosophical, theological and spiritual formation of the diocese's future priests.", rw: "Grand Séminaire ya Kabgayi itanga inyigisho za filozofi, iy'ubuvugizi n'iz'umwuka ku bazaba abapadiri ba diyosezi." } },
      { slug: "ecoles-privees", key: "sub_ecoles_privees", icon: <School />, img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80", desc: { fr: "Les Écoles Catholiques privées du diocèse offrent un enseignement de qualité fondé sur des valeurs chrétiennes solides.", en: "The diocese's private Catholic schools offer quality education founded on solid Christian values.", rw: "Amashuri Gatolika y'abikorera ya diyosezi atanga uburezi bwiza bushingiye ku ndangagaciro za gikristu zikomeye." } },
      { slug: "ecoles-conventionnees", key: "sub_ecoles_conventionnees", icon: <BookOpen />, img: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=600&q=80", desc: { fr: "Les Écoles Catholiques conventionnées collaborent avec l'État tout en gardant leur caractère propre et leur mission évangélisatrice.", en: "The state-partnered Catholic schools collaborate with the government while retaining their distinct character and evangelizing mission.", rw: "Amashuri Gatolika y'amasezerano akorana na Leta ariko akomeza umwihariko wayo n'inshingano yo gutangaza Ubutumwa." } },
    ],
  },
  documentation: {
    hero: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80",
    titleKey: "page_documentation",
    navKey: "nav_documentation",
    items: [
      { slug: "homelies", key: "sub_homelies", icon: <Book />, img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", desc: { fr: "Retrouvez les homélies de notre Évêque et des prêtres du diocèse pour vous nourrir de la Parole de Dieu.", en: "Find the homilies of our Bishop and the priests of the diocese to nourish yourself with the Word of God.", rw: "Shaka insiguro z'Umusenyeri wacu n'abapadiri ba diyosezi kugira ngo ufashe ijambo ry'Imana." } },
      { slug: "mwigisha", key: "sub_mwigisha", icon: <BookOpen />, img: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=600&q=80", desc: { fr: "Mwigisha est la revue catéchétique du Diocèse de Kabgayi, un outil précieux pour la formation des catéchistes.", en: "Mwigisha is the catechetical review of the Diocese of Kabgayi, a valuable tool for the training of catechists.", rw: "Mwigisha ni ikinyamakuru cy'inyigisho za Diyosezi ya Kabgayi, igikoresho cy'agaciro mu guha inyigisho abakatekisiti." } },
      { slug: "urumuri", key: "sub_urumuri", icon: <Lightbulb />, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", desc: { fr: "Urumuri Rwa Kristu — La Lumière du Christ — est la publication diocésaine qui partage les nouvelles de l'Église et de la foi.", en: "Urumuri Rwa Kristu — The Light of Christ — is the diocesan publication sharing news of the Church and faith.", rw: "Urumuri Rwa Kristu ni gaseti ya diyosezi isangira amakuru y'Itorero n'ukwizera." } },
      { slug: "nouvelles", key: "sub_nouvelles", icon: <Newspaper />, img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80", desc: { fr: "Les Nouvelles du Diocèse de Kabgayi vous tiennent informés des activités, événements et annonces du diocèse.", en: "The News of the Diocese of Kabgayi keeps you informed of activities, events and announcements from the diocese.", rw: "Amakuru ya Diyosezi ya Kabgayi akumenyesha ibikorwa, ibirori n'itangazo rya diyosezi." } },
    ],
  },
  liturgie: {
    hero: "https://images.unsplash.com/photo-1545050073-c2d4693c3c16?w=1600&q=80",
    titleKey: "nav_accueil_liturgique",
    navKey: "nav_accueil_liturgique",
    items: [
      { slug: "jour", key: "sub_liturgie", icon: <Calendar />, img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80", desc: { fr: "Retrouvez chaque jour les lectures, le psaume et l'évangile de la liturgie catholique pour nourrir votre prière quotidienne.", en: "Find each day the readings, psalm and gospel of the Catholic liturgy to nourish your daily prayer.", rw: "Buri munsi shaka amasomero, indirimbo ya Zaburi n'Ubutumwa Bwiza bw'ibadiho Gatolika kugira ngo ufashe gusenga buri munsi." } },
      { slug: "videos", key: "sub_videos", icon: <Video />, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", desc: { fr: "Regardez les messes, célébrations, conférences et événements du Diocèse de Kabgayi en vidéo.", en: "Watch Masses, celebrations, conferences and events from the Diocese of Kabgayi on video.", rw: "Reba amisa, ibirori, inama n'ibikorwa bya Diyosezi ya Kabgayi mu mashusho." } },
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
              {(item.desc[lang] || item.desc.fr).split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('1.') || trimmed.startsWith('Au niveau') || trimmed.startsWith('Dénomination') || trimmed.startsWith('1.1') || 
                    trimmed === 'A PROPOS DE NOUS' || trimmed === 'MISSION' || trimmed === 'VISION' || trimmed === 'VALEURS') {
                  return <h3 key={idx} style={{marginTop: idx > 0 ? '24px' : '0', marginBottom: '12px', color: 'var(--navy)', fontFamily: 'var(--font-serif)', fontSize: '18px'}}>{paragraph}</h3>;
                }
                return <p key={idx} style={{marginBottom: '14px'}}>{paragraph}</p>;
              })}
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
            <Link
              key={item.slug}
              to={item.sectionLink || `/${section}/${item.slug}`}
              className="service-card"
            >
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
