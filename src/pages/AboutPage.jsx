import { useState } from "react";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";
import eveque from '../assets/portrait_eveque_-_copy_2_-9a431.jpg';
import kabgayi from '../assets/kabgayi.jpg';

// ── Fallback content (used when the database has no data yet) ──────────
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

const FALLBACK_CONTENT = {
  fr: {
    title: "À Propos du Diocèse de Kabgayi",
    subtitle: "Une Église particulière au cœur du Rwanda",
    diocese_tab: "Le Diocèse",
    bishop_tab: "Notre Évêque",
    diocese: {
      title: "Le Diocèse de Kabgayi",
      text: `Le diocèse de Kabgayi est une circonscription de l'Église catholique au Rwanda, dont le siège est situé à Gitarama, dans la Province du Sud. Il s'étend sur 2 187 km² à travers les districts de Muhanga, Kamonyi, Ruhango et Nyanza. Son évêque actuel, Mgr Balthazar Ntivuguruzwa, a été ordonné en juin 2023.

Le Diocèse de Kabgayi est composé aujourd'hui de 31 paroisses. Les deux nouvelles paroisses sont celles de Kabugondo et Gasovu fondées en 2024.`,
      statsTitle: "Statistiques du Diocèse 2026",
      statsLabels: {
        population: "Population", baptises: "Baptisés Catholiques", catechumenes: "Catéchumènes",
        total_catholiques: "Total Catholiques", pct_cath: "% des Cath. / Pop. Totale", paroisses: "Paroisses",
        centrales: "Centrales", comites_base: "Comités Ecclésiales de Base", pretres: "Prêtres",
        pretres_diocesains: "Prêtres Diocésains", pretres_religieux: "Prêtres Religieux", religieux: "Religieux",
        religieuses: "Religieuses", communautes_masc: "Communautés Masculines", communautes_fem: "Communautés Féminines",
        catechistes: "Catéchistes", grands_seminaristes: "Grands Séminaristes", petits_seminaristes: "Petits Séminaristes",
        ecoles: "Écoles", ecoles_primaires: "Écoles Primaires", ecoles_secondaires: "Écoles Secondaires",
        ecoles_superieures: "Écoles Supérieures Laïques", formations_sanitaires: "Formations Sanitaires de l'Église",
        centres_sante: "Centres de Santé", hopitaux: "Hôpitaux",
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
      text: `The Diocese of Kabgayi is a circumscription of the Catholic Church in Rwanda, with its seat in Gitarama, in the Southern Province. Its current bishop, Mgr Balthazar Ntivuguruzwa, was ordained in June 2023.

The Diocese of Kabgayi currently comprises 31 parishes. The two new parishes are Kabugondo and Gasovu, founded in 2024.`,
      statsTitle: "Diocese Statistics 2026",
      statsLabels: {
        population: "Population", baptises: "Baptized Catholics", catechumenes: "Catechumens",
        total_catholiques: "Total Catholics", pct_cath: "% Catholics / Total Pop.", paroisses: "Parishes",
        centrales: "Central Stations", comites_base: "Basic Ecclesial Communities", pretres: "Priests",
        pretres_diocesains: "Diocesan Priests", pretres_religieux: "Religious Priests", religieux: "Religious Brothers",
        religieuses: "Religious Sisters", communautes_masc: "Male Communities", communautes_fem: "Female Communities",
        catechistes: "Catechists", grands_seminaristes: "Major Seminarians", petits_seminaristes: "Minor Seminarians",
        ecoles: "Schools", ecoles_primaires: "Primary Schools", ecoles_secondaires: "Secondary Schools",
        ecoles_superieures: "Lay Higher Education Schools", formations_sanitaires: "Church Health Facilities",
        centres_sante: "Health Centers", hopitaux: "Hospitals",
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
      text: `Diyosezi ya Kabgayi ni ingengabitekerezo y'Itorero Gatolika mu Rwanda, aho icyicaro cya Gitarama, mu Ntara y'Epfo. Umusenyeri wayo ubu, Mgr Balthazar Ntivuguruzwa, yashinzwe mu kwezi wa Nyakanga 2023.

Kabgayi, iherereye mu Ntara y'Epfo ya Rwanda, ni icyicaro cy'Umusenyeri kandi ikigarama nka Katedrale ya Notre-Dame ya Kabgayi.`,
      statsTitle: "Imibare y'Ingenzi ya Diyosezi 2026",
      statsLabels: {
        population: "Abaturage", baptises: "Ababatijwe Abagatolika", catechumenes: "Abatoza",
        total_catholiques: "Abagatolika Bose", pct_cath: "% y'Abagatolika ku Baturage Bose", paroisses: "Amaparuwasi",
        centrales: "Ibigo Nkuru", comites_base: "Amatorero Mato", pretres: "Abapadiri",
        pretres_diocesains: "Abapadiri ba Diyosezi", pretres_religieux: "Abapadiri b'Amashyirahamwe", religieux: "Abarumuna",
        religieuses: "Abaseturi", communautes_masc: "Amashyirahamwe y'Abagabo", communautes_fem: "Amashyirahamwe y'Abagore",
        catechistes: "Abatekiseri", grands_seminaristes: "Abasemenari Bakuru", petits_seminaristes: "Abasemenari Bato",
        ecoles: "Amashuri", ecoles_primaires: "Amashuri Abanza", ecoles_secondaires: "Amashuri Yisumbuye",
        ecoles_superieures: "Amashuri Makuru y'Abasivili", formations_sanitaires: "Ivuriro ry'Itorero",
        centres_sante: "Ibigo Nderabuzima", hopitaux: "Ibitaro",
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
function DioceseStatsTable({ statsTitle, headers, rows }) {
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
                  textAlign: 'left', padding: '14px 20px', color: '#fff',
                  fontFamily: 'var(--font-serif)', fontWeight: '600', letterSpacing: '0.02em',
                }}
              >
                {headers.designation}
              </th>
              <th
                style={{
                  textAlign: 'right', padding: '14px 20px', color: '#fff',
                  fontFamily: 'var(--font-serif)', fontWeight: '600', letterSpacing: '0.02em',
                }}
              >
                {headers.figure}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (row.is_section) {
                return (
                  <tr key={`section-${i}`}>
                    <td
                      colSpan={2}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'rgba(var(--red-rgb, 178, 34, 52), 0.08)',
                        color: 'var(--red)', fontWeight: '700', fontSize: '13px',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {row.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={`row-${i}`} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                  <td style={{ padding: '12px 20px', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                    {row.label}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px', textAlign: 'right', color: 'var(--navy)', fontWeight: '700',
                      fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid var(--border)',
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
function BishopCollaborators({ collaboratorsTitle, collaborators }) {
  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '20px', marginBottom: '16px' }}>
        {collaboratorsTitle}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {collaborators.map((person, i) => (
          <li
            key={i}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              flexWrap: 'wrap', gap: '8px 16px', padding: '12px 0',
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
  const { data } = useApi("/api/about", { content: {}, stats: [], collaborators: [] });
  const [activeTab, setActiveTab] = useState('diocese'); // 'diocese' or 'bishop'

  const fallback = FALLBACK_CONTENT[lang] || FALLBACK_CONTENT.fr;
  const db = data?.content || {};
  const dbStats = data?.stats || [];
  const dbCollab = data?.collaborators || [];

  // Resolve a trilingual DB column with a fallback to the static content.
  const L = (base, fb) => {
    const v = lang === "en" ? db[`${base}_en`] : lang === "rw" ? db[`${base}_rw`] : db[`${base}_fr`];
    return (v && String(v).trim()) ? v : fb;
  };

  const heroTitle    = L("hero_title", fallback.title);
  const heroSubtitle = L("hero_subtitle", fallback.subtitle);
  const dioceseTab   = L("diocese_tab", fallback.diocese_tab);
  const bishopTab    = L("bishop_tab", fallback.bishop_tab);

  const dioceseTitle = L("diocese_title", fallback.diocese.title);
  const dioceseText  = L("diocese_text", fallback.diocese.text);
  const statsTitle   = L("stats_title", fallback.diocese.statsTitle);
  const statsHeaders = {
    designation: L("stats_designation", fallback.diocese.statsHeaders.designation),
    figure: L("stats_figure", fallback.diocese.statsHeaders.figure),
  };

  const bishopTitle = L("bishop_title", fallback.bishop.title);
  const bishopRole  = L("bishop_role", fallback.bishop.role);
  const bishopText  = L("bishop_text", fallback.bishop.text);
  const collabTitle = L("collab_title", fallback.bishop.collaboratorsTitle);

  const dioceseImg = db.diocese_image ? resolveImg(db.diocese_image) : kabgayi;
  const bishopImg  = db.bishop_image  ? resolveImg(db.bishop_image)  : eveque;

  // Statistics rows — prefer DB, else derive from the static dataset.
  const statsRows = dbStats.length
    ? dbStats.map((s) => ({
        label: (lang === "en" ? s.label_en : lang === "rw" ? s.label_rw : s.label_fr) || s.label_fr || "",
        value: s.value || "",
        is_section: !!s.is_section,
      }))
    : dioceseStatsData.map((row) => row.section
        ? { label: fallback.diocese.statsLabels[row.section], value: "", is_section: true }
        : { label: fallback.diocese.statsLabels[row.key], value: row.value, is_section: false });

  // Collaborators — prefer DB, else static.
  const collaborators = dbCollab.length
    ? dbCollab.map((p) => ({
        name: p.name || "",
        role: (lang === "en" ? p.role_en : lang === "rw" ? p.role_rw : p.role_fr) || p.role_fr || "",
      }))
    : fallback.bishop.collaborators;

  return (
    <main id="main-content">
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: `url(${activeTab === 'diocese' ? dioceseImg : bishopImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-hero-overlay" aria-hidden="true"></div>
        <div className="page-hero-content">
          <div className="section-label">{t("nav_about")}</div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
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
              padding: '12px 32px', fontSize: '16px',
              fontWeight: activeTab === 'diocese' ? '700' : '500',
              color: activeTab === 'diocese' ? 'var(--red)' : 'var(--text)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: activeTab === 'diocese' ? '3px solid var(--red)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {dioceseTab}
          </button>
          <button
            onClick={() => setActiveTab('bishop')}
            style={{
              padding: '12px 32px', fontSize: '16px',
              fontWeight: activeTab === 'bishop' ? '700' : '500',
              color: activeTab === 'bishop' ? 'var(--red)' : 'var(--text)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: activeTab === 'bishop' ? '3px solid var(--red)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {bishopTab}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'diocese' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '28px' }}>{dioceseTitle}</h2>
              <div className="section-divider" style={{ margin: '16px auto' }} aria-hidden="true"></div>
            </div>
            <img
              src={dioceseImg}
              alt={dioceseTitle}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}
            />
            <div style={{ fontSize: '16px', color: 'var(--text)', lineHeight: '1.9' }}>
              {dioceseText.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: '16px' }}>{p}</p>)}
            </div>

            {/* Statistics table */}
            <DioceseStatsTable statsTitle={statsTitle} headers={statsHeaders} rows={statsRows} />
          </div>
        )}

        {activeTab === 'bishop' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start' }}>
            <img
              src={bishopImg}
              alt={bishopTitle}
              style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', objectFit: 'cover' }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', fontSize: '28px', marginBottom: '8px' }}>{bishopTitle}</h2>
              <p style={{ fontSize: '16px', color: 'var(--red)', fontWeight: '600', marginBottom: '20px' }}>{bishopRole}</p>
              <div className="section-divider" style={{ marginBottom: '20px' }} aria-hidden="true"></div>
              <div style={{ fontSize: '16px', color: 'var(--text)', lineHeight: '1.9' }}>
                {bishopText.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: '16px' }}>{p}</p>)}
              </div>

              {/* Collaborators list */}
              <BishopCollaborators collaboratorsTitle={collabTitle} collaborators={collaborators} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
