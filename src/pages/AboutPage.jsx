import { useState } from "react";
import { useLang } from "../context/LanguageContext";
import eveque from '../assets/portrait_eveque_-_copy_2_-9a431.jpg';
import kabgayi from '../assets/kabgayi.jpg';

// Raw stats data (language-independent values, section markers, and translation keys)
const dioceseStatsData = [
  { key: "population", value: "1 120 821" },
  { key: "baptises", value: "666 097" },
  { key: "catechumenes", value: "5 668" },
  { key: "total_catholiques", value: "638 368" },
  { key: "pct_cath", value: "59.20%" },
  { key: "paroisses", value: "31" },
  { key: "centrales", value: "507" },
  { key: "comites_base", value: "5 927" },
  { section: "pretres" },
  { key: "pretres_diocesains", value: "80" },
  { key: "pretres_religieux", value: "20" },
  { key: "religieux", value: "77" },
  { key: "religieuses", value: "430" },
  { key: "communautes_masc", value: "15" },
  { key: "communautes_fem", value: "36" },
  { key: "catechistes", value: "740" },
  { key: "grands_seminaristes", value: "65" },
  { key: "petits_seminaristes", value: "306" },
  { section: "ecoles" },
  { key: "ecoles_primaires", value: "127" },
  { key: "ecoles_secondaires", value: "105" },
  { key: "ecoles_superieures", value: "1" },
  { section: "formations_sanitaires" },
  { key: "centres_sante", value: "10" },
  { key: "hopitaux", value: "2" },
];

const content = {
  fr: {
    title: "À Propos du Diocèse de Kabgayi",
    subtitle: "Une Église particulière au cœur du Rwanda",
    diocese_tab: "Le Diocèse",
    bishop_tab: "Notre Évêque",
    diocese: {
      title: "Le Diocèse de Kabgayi",
      text: `Le diocèse de Kabgayi est une circonscription de l'Église catholique au Rwanda, dont le siège est situé à Gitarama, dans la Province du Sud. Il s'étend sur 2 187 km² à travers les districts de Muhanga, Kamonyi, Ruhango et Nyanza. Son évêque actuel, Mgr Balthazar Ntivuguruzwa, a été ordonné en juin 2023.

Le territoire du Diocèse de Kabgayi se situe en province Sud du Rwanda, et couvre l’étendue de trois districts à savoir Kamonyi, Muhanga et Ruhango ainsi qu’une petite portion du district de Nyanza sur une superficie de 2.187 km2. D’après les statistiques de l’année 2023, le diocèse de Kabgayi compte 695.920 catholiques sur une population approximative de 1.203.959 habitants, ce qui fait une portion de 57,8% de toute la population avec une diminution de 4% par rapport à l’année 2022.

Le Diocèse de Kabgayi est composé aujourd’hui de 31 paroisses. Les deux nouvelles paroisses sont celles de Kabugondo et Gasovu fondées en 2024.

Carte géographique du Diocèse

Au niveau du Personnel apostolique, le nombre des prêtres diocésains résidents dans le Diocèse et dans les services interdiocésains au Rwanda s’élève à 101. Le diocèse compte 10 prêtres religieux qui font leur apostolat sous convention. Le total général de tous les prêtres diocésains, y compris ceux qui sont aux études et d’autres qui vivent à l’étranger, s’élève au nombre de 154 prêtres incardinés.

BREVE CHRONOLOGIE HIERARCHIQUE DU DIOCESE DE KABGAYI

L’histoire du Diocèse de Kabgayi se confond jusqu’en 1952 avec l’histoire religieuse du Christianisme au Rwanda.
Phase missionnaire : Kabgayi à l’époque des vicariats (1912-1959)
Jusqu’en 1912, le Rwanda était rattaché au Vicariat Apostolique du Nyanza- Méridional, juridiction ecclésiastique dont le chef-lieu se situait au-delà de l’Akagera, à Kashozi (Tanzanie). Son Excellence Mgr Hirth devint le Vicaire Apostolique de cette juridiction.`,
      statsTitle: "Statistiques du Diocèse 2026",
      statsLabels: {
        population: "Population",
        baptises: "Baptisés Catholiques",
        catechumenes: "Catéchumènes",
        total_catholiques: "Total Catholiques",
        pct_cath: "% des Cath. / Pop. Totale",
        paroisses: "Paroisses",
        centrales: "Centrales",
        comites_base: "Comités Ecclésiales de Base",
        pretres: "Prêtres",
        pretres_diocesains: "Prêtres Diocésains",
        pretres_religieux: "Prêtres Religieux",
        religieux: "Religieux",
        religieuses: "Religieuses",
        communautes_masc: "Communautés Masculines",
        communautes_fem: "Communautés Féminines",
        catechistes: "Catéchistes",
        grands_seminaristes: "Grands Séminaristes",
        petits_seminaristes: "Petits Séminaristes",
        ecoles: "Écoles",
        ecoles_primaires: "Écoles Primaires",
        ecoles_secondaires: "Écoles Secondaires",
        ecoles_superieures: "Écoles Supérieures Laïques",
        formations_sanitaires: "Formations Sanitaires de l'Église",
        centres_sante: "Centres de Santé",
        hopitaux: "Hôpitaux",
      },
      statsHeaders: { designation: "Désignation", figure: "Chiffre" },
    },
    bishop: {
      title: "Mgr Balthazar Ntivuguruzwa",
      role: "Évêque du Diocèse de Kabgayi",
      text: `Mgr Balthazar Ntivuguruzwa est l'évêque actuel du Diocèse de Kabgayi, ordonné en juin 2023.`,
      collaboratorsTitle: "Ses Collaborateurs",
      collaborators: [
        { name: "Mgr Hodari Jean de Dieu", role: "Vicaire Général" },
        { name: "Abbé Joseph Emmanuel Kageruka", role: "Chancelier" },
        { name: "Abbé Alype Hategekimana", role: "Secrétaire de l'Évêché" },
        { name: "Abbé Eugène Dushimimana", role: "Économe du Diocèse" },
      ],
    }
  },
  en: {
    title: "About the Diocese of Kabgayi",
    subtitle: "A particular Church at the heart of Rwanda",
    diocese_tab: "The Diocese",
    bishop_tab: "Our Bishop",
    diocese: {
      title: "The Diocese of Kabgayi",
      text: `The Diocese of Kabgayi is a circumscription of the Catholic Church in Rwanda, with its seat in Gitarama, in the Southern Province. It covers an area of 2,187 km² across the districts of Muhanga, Kamonyi, Ruhango and Nyanza. Its current bishop, Mgr Balthazar Ntivuguruzwa, was ordained in June 2023.

The Diocese of Kabgayi is located in the Southern Province of Rwanda and covers three districts: Kamonyi, Muhanga, and Ruhango, as well as a small portion of the Nyanza district, encompassing an area of 2,187 km². According to 2023 statistics, the Diocese of Kabgayi has 695,920 Catholics out of an approximate population of 1,203,959, representing 57.8% of the total population, a decrease of 4% compared to 2022.

The Diocese of Kabgayi currently comprises 31 parishes. The two new parishes are Kabugondo and Gasovu, founded in 2024.

Geographical Map of the Diocese

Regarding the apostolic personnel, the number of diocesan priests residing in the Diocese and serving in interdiocesan offices in Rwanda is 101. The diocese has 10 religious priests who carry out their ministry under contract. The total number of all diocesan priests, including those studying and others living abroad, is 154 incardinated priests.

BRIEF HIERARCHICAL CHRONOLOGY OF THE DIOCESE OF KABGAYI

The history of the Diocese of Kabgayi is intertwined with the religious history of Christianity in Rwanda until 1952. Missionary Phase: Kabgayi during the Vicariate Era (1912-1959)
Until 1912, Rwanda was part of the Apostolic Vicariate of Southern Nyanza, an ecclesiastical jurisdiction whose capital was located beyond the Akagera River, in Kashozi (Tanzania). His Excellency Bishop Hirth became the Apostolic Vicar of this jurisdiction.`,
      statsTitle: "Diocese Statistics 2026",
      statsLabels: {
        population: "Population",
        baptises: "Baptized Catholics",
        catechumenes: "Catechumens",
        total_catholiques: "Total Catholics",
        pct_cath: "% Catholics / Total Pop.",
        paroisses: "Parishes",
        centrales: "Central Stations",
        comites_base: "Basic Ecclesial Communities",
        pretres: "Priests",
        pretres_diocesains: "Diocesan Priests",
        pretres_religieux: "Religious Priests",
        religieux: "Religious Brothers",
        religieuses: "Religious Sisters",
        communautes_masc: "Male Communities",
        communautes_fem: "Female Communities",
        catechistes: "Catechists",
        grands_seminaristes: "Major Seminarians",
        petits_seminaristes: "Minor Seminarians",
        ecoles: "Schools",
        ecoles_primaires: "Primary Schools",
        ecoles_secondaires: "Secondary Schools",
        ecoles_superieures: "Lay Higher Education Schools",
        formations_sanitaires: "Church Health Facilities",
        centres_sante: "Health Centers",
        hopitaux: "Hospitals",
      },
      statsHeaders: { designation: "Designation", figure: "Figure" },
    },
    bishop: {
      title: "Mgr Balthazar Ntivuguruzwa",
      role: "Bishop of the Diocese of Kabgayi",
      text: `Mgr Balthazar Ntivuguruzwa is the current bishop of the Diocese of Kabgayi, ordained in June 2023.`,
      collaboratorsTitle: "His Collaborators",
      collaborators: [
        { name: "Mgr Hodari Jean de Dieu", role: "Vicar General" },
        { name: "Abbé Joseph Emmanuel Kageruka", role: "Chancellor" },
        { name: "Abbé Alype Hategekimana", role: "Secretary of the Bishopric" },
        { name: "Abbé Eugène Dushimimana", role: "Diocesan Bursar" },
      ],
    }
  },
  rw: {
    title: "Ibyerekeye Diyosezi ya Kabgayi",
    subtitle: "Itorero ryihariye mu Rwanda",
    diocese_tab: "Diyosezi",
    bishop_tab: "Umusenyeri Wacu",
    diocese: {
      title: "Diyosezi ya Kabgayi",
      text: `Diyosezi ya Kabgayi ni ingengabitekerezo y'Itorero Gatolika mu Rwanda, aho icyicaro cya Gitarama, mu Ntara y'Epfo. Igizwe ku 2,187 km² kuzuye imirenge ya Muhanga, Kamonyi, Ruhango na Nyanza. Umusenyeri wayo ubu, Mgr Balthazar Ntivuguruzwa, yashinzwe mu kwezi wa Nyakanga 2023.

Diyosezi ya Kabgayi ni imwe mu Diyosezi za kera za Gatolika mu Rwanda. Yashinzwe mu ntangiriro z'ikinyejana cya 20 n'Ubutumwa bw'Abapadiri b'i Afrika (Pères Blancs), kandi yakoreye mu gukurura abantu kuri Yesu Kristu no guteza imbere abantu mu Rwanda.

Kabgayi, iherereye mu Ntara y'Epfo ya Rwanda, ni icyicaro cy'Umusenyeri kandi ikigarama nka Katedrale ya Notre-Dame ya Kabgayi, imwe mu nziza kandi za kera mu gihugu.

Mu myaka ishize, Diyosezi yahuye n'ibihe byinshi bigoye n'iby'itumaini, harimo jenoside yo mu 1994 yakomerekeje umutima w'umuryango w'abakristu. Ubu, izirikana ukwizera n'ubwunvikane.`,
      statsTitle: "Imibare y'Ingenzi ya Diyosezi 2026",
      statsLabels: {
        population: "Abaturage",
        baptises: "Ababatijwe Abagatolika",
        catechumenes: "Abatoza",
        total_catholiques: "Abagatolika Bose",
        pct_cath: "% y'Abagatolika ku Baturage Bose",
        paroisses: "Amaparuwasi",
        centrales: "Ibigo Nkuru",
        comites_base: "Amatorero Mato",
        pretres: "Abapadiri",
        pretres_diocesains: "Abapadiri ba Diyosezi",
        pretres_religieux: "Abapadiri b'Amashyirahamwe",
        religieux: "Abarumuna",
        religieuses: "Abaseturi",
        communautes_masc: "Amashyirahamwe y'Abagabo",
        communautes_fem: "Amashyirahamwe y'Abagore",
        catechistes: "Abatekiseri",
        grands_seminaristes: "Abasemenari Bakuru",
        petits_seminaristes: "Abasemenari Bato",
        ecoles: "Amashuri",
        ecoles_primaires: "Amashuri Abanza",
        ecoles_secondaires: "Amashuri Yisumbuye",
        ecoles_superieures: "Amashuri Makuru y'Abasivili",
        formations_sanitaires: "Ivuriro ry'Itorero",
        centres_sante: "Ibigo Nderabuzima",
        hopitaux: "Ibitaro",
      },
      statsHeaders: { designation: "Icyo Bigaragaza", figure: "Umubare" },
    },
    bishop: {
      title: "Mgr Balthazar Ntivuguruzwa",
      role: "Umusenyeri wa Diyosezi ya Kabgayi",
      text: `Mgr Balthazar Ntivuguruzwa ni umusenyeri w'ubu wa Diyosezi ya Kabgayi, yashinzwe mu kwezi wa Nyakanga 2023.`,
      collaboratorsTitle: "Abafasha be",
      collaborators: [
        { name: "Mgr Hodari Jean de Dieu", role: "Visi Jenerali" },
        { name: "Abbé Joseph Emmanuel Kageruka", role: "Shanseliye" },
        { name: "Abbé Alype Hategekimana", role: "Umunyamabanga w'Ubwepiskopi" },
        { name: "Abbé Eugène Dushimimana", role: "Umubitsi wa Diyosezi" },
      ],
    }
  }
};

// Reusable, self-contained statistics table for the Diocese tab
function DioceseStatsTable({ diocese }) {
  const { statsTitle, statsLabels, statsHeaders } = diocese;

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '24px' }}>
          {statsTitle}
        </h3>
        <div className="section-divider" style={{ margin: '16px auto' }} aria-hidden="true"></div>
      </div>

      <div
        style={{
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--navy)' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '14px 20px',
                  color: '#fff',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                }}
              >
                {statsHeaders.designation}
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '14px 20px',
                  color: '#fff',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                }}
              >
                {statsHeaders.figure}
              </th>
            </tr>
          </thead>
          <tbody>
            {dioceseStatsData.map((row, i) => {
              if (row.section) {
                return (
                  <tr key={`section-${row.section}`}>
                    <td
                      colSpan={2}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'rgba(var(--red-rgb, 178, 34, 52), 0.08)',
                        color: 'var(--red)',
                        fontWeight: '700',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {statsLabels[row.section]}
                    </td>
                  </tr>
                );
              }
              return (
                <tr
                  key={row.key}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 20px',
                      color: 'var(--text)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {statsLabels[row.key]}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      textAlign: 'right',
                      color: 'var(--navy)',
                      fontWeight: '700',
                      fontVariantNumeric: 'tabular-nums',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {row.value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Collaborators list rendered under the bishop's bio text
function BishopCollaborators({ bishop }) {
  const { collaboratorsTitle, collaborators } = bishop;

  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div style={{ marginTop: '32px' }}>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--navy)',
          fontSize: '20px',
          marginBottom: '16px',
        }}
      >
        {collaboratorsTitle}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {collaborators.map((person, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '8px 16px',
              padding: '12px 0',
              borderBottom: i < collaborators.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ fontWeight: '600', color: 'var(--text)' }}>{person.name}</span>
            <span style={{ color: 'var(--red)', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>
              {person.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  const { t, lang } = useLang();
  const c = content[lang] || content.fr;
  const [activeTab, setActiveTab] = useState('diocese'); // 'diocese' or 'bishop'

  return (
    <main id="main-content">
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: `url(${activeTab === 'diocese' ? kabgayi : eveque})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{t("nav_about")}</div>
          <h1>{c.title}</h1>
          <p>{c.subtitle}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <a href="/">{t("nav_home")}</a>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{t("nav_about")}</span>
      </nav>

      {/* Content */}
      <div className="page-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '20px', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('diocese')}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: activeTab === 'diocese' ? '700' : '500',
              color: activeTab === 'diocese' ? 'var(--red)' : 'var(--text)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === 'diocese' ? '3px solid var(--red)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {c.diocese_tab}
          </button>
          <button
            onClick={() => setActiveTab('bishop')}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: activeTab === 'bishop' ? '700' : '500',
              color: activeTab === 'bishop' ? 'var(--red)' : 'var(--text)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === 'bishop' ? '3px solid var(--red)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {c.bishop_tab}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'diocese' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '28px' }}>{c.diocese.title}</h2>
              <div className="section-divider" style={{ margin: '16px auto' }} aria-hidden="true"></div>
            </div>
            <img
              src={kabgayi}
              alt="Diocèse de Kabgayi"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div style={{ fontSize: '16px', color: 'var(--text)', lineHeight: '1.9' }}>
              {c.diocese.text.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: '16px' }}>{p}</p>)}
            </div>

            {/* Statistics table */}
            <DioceseStatsTable diocese={c.diocese} />
          </div>
        )}

        {activeTab === 'bishop' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start' }}>
            <img
              src={eveque}
              alt="Évêque du Diocèse de Kabgayi"
              style={{
                width: '100%',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                objectFit: 'cover'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '28px', marginBottom: '8px' }}>{c.bishop.title}</h2>
              <p style={{ fontSize: '16px', color: 'var(--red)', fontWeight: '600', marginBottom: '20px' }}>{c.bishop.role}</p>
              <div className="section-divider" style={{ marginBottom: '20px' }} aria-hidden="true"></div>
              <div style={{ fontSize: '16px', color: 'var(--text)', lineHeight: '1.9' }}>
                {c.bishop.text.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: '16px' }}>{p}</p>)}
              </div>

              {/* Collaborators list */}
              <BishopCollaborators bishop={c.bishop} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}