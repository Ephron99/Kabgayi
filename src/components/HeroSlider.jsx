import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";

const BACKEND = "http://localhost:5000";
const resolveImg = (url) => (!url ? "" : url.startsWith("http") ? url : `${BACKEND}${url}`);

const STATIC_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1548625149-720754952028?w=900&q=85",
    badge: "DIOCÈSE DE KABGAYI",
    titleFr: "Annoncer le Christ,\nConstruire la Paix.",
    titleEn: "Proclaiming Christ,\nBuilding Peace.",
    titleRw: "Gutangaza Kristu,\nOkubaka Amahoro.",
    descFr: "Unis dans la foi, nous annonçons l'Évangile, servons nos frères et bâtissons un monde plus juste et fraternel.",
    descEn: "United in faith, we proclaim the Gospel, serve our brothers and sisters, and build a more just and fraternal world.",
    descRw: "Hamwe mu kwizera, turatangaza Ubutumwa Bwiza kandi tubaka isi y'ubutabera n'ubwumvikane.",
    points: {
      fr: ["Fondé sur la foi catholique depuis 1912", "47 paroisses au service du peuple de Dieu", "Présence active dans l'éducation et la santé"],
      en: ["Founded on the Catholic faith since 1912", "47 parishes serving the people of God", "Active presence in education and health"],
      rw: ["Ishingiye ku kwizera gwa Gatolika kuva 1912", "Paruwasi 47 zisukura abantu b'Imana", "Irimo mu burezi n'ubuvuzi"],
    },
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&q=85",
    badge: "PASTORALE",
    titleFr: "Une Église au Service\nde Tous.",
    titleEn: "A Church at the Service\nof All.",
    titleRw: "Itorero Risukura\nBose.",
    descFr: "Le Diocèse de Kabgayi accompagne les fidèles dans leur vie spirituelle, sociale et humaine.",
    descEn: "The Diocese of Kabgayi accompanies the faithful in their spiritual, social and human life.",
    descRw: "Diyosezi ya Kabgayi ifasha abakristu mu buzima bw'ubuzimu, imibereho n'imigenzo.",
    points: {
      fr: ["Hôpital de Kabgayi au service des malades", "Centres de spiritualité et retraites", "Caritas pour les plus démunis"],
      en: ["Kabgayi Hospital serving the sick", "Spirituality centers and retreats", "Caritas for the most vulnerable"],
      rw: ["Ibitaro bya Kabgayi bisukura abarwayi", "Ibigo bya spiritualité n'amahugurwa", "Caritas ifasha abakene"],
    },
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=900&q=85",
    badge: "ÉDUCATION & CULTURE",
    titleFr: "Former les Hommes,\nÉclairer les Esprits.",
    titleEn: "Educating People,\nEnlightening Minds.",
    titleRw: "Guhugura Abantu,\nGukangura Ibitekerezo.",
    descFr: "À travers l'Institut Catholique et l'Imprimerie de Kabgayi, nous investissons dans l'avenir du Rwanda.",
    descEn: "Through the Catholic Institute and Kabgayi Print House, we invest in Rwanda's future.",
    descRw: "Binyuze mu Inshuri Gatolika n'inzego z'ibyapa, tushyira igihugu cy'Rwanda mu gihe kizaza.",
    points: {
      fr: ["Institut Catholique de Kabgayi", "Réseau d'écoles catholiques", "Imprimerie et publication diocésaines"],
      en: ["Catholic Institute of Kabgayi", "Network of Catholic schools", "Diocesan printing and publishing"],
      rw: ["Inshuri Gatolika ya Kabgayi", "Amashuri menshi ya Gatolika", "Inzego z'ibyapa na gaseti ya diyosezi"],
    },
  },
];

const INTERVAL = 6000;
const ANIM_DURATION = 650;

export default function HeroSlider() {
  const { lang, t } = useLang();

  // Fetch slides from backend, fall back to static ones
  const { data: apiSlides } = useApi("/api/hero", null);
  const slides = (apiSlides && apiSlides.length > 0) ? apiSlides : STATIC_SLIDES;

  // Use ref to always have latest index inside the interval callback
  const currentRef = useRef(0);
  const [current, _setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const setCurrent = (val) => {
    currentRef.current = val;
    _setCurrent(val);
  };

  const advance = useCallback(() => {
    const next = (currentRef.current + 1) % slides.length;
    transition(next);
  }, [slides.length]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL);
  }, [advance]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const transition = (next) => {
    if (isAnimating || next === currentRef.current) return;
    setIsAnimating(true);
    setPrev(currentRef.current);
    setCurrent(next);
    setTimeout(() => {
      setPrev(null);
      setIsAnimating(false);
    }, ANIM_DURATION);
  };

  const handlePrev = () => {
    const next = (currentRef.current - 1 + slides.length) % slides.length;
    transition(next);
    resetTimer();
  };

  const handleNext = () => {
    const next = (currentRef.current + 1) % slides.length;
    transition(next);
    resetTimer();
  };

  const handleDot = (i) => {
    transition(i);
    resetTimer();
  };

  const getTitle = (s) => lang === "en" ? s.titleEn : lang === "rw" ? s.titleRw : s.titleFr;
  const getDesc  = (s) => lang === "en" ? s.descEn  : lang === "rw" ? s.descRw  : s.descFr;
  const getPoints = (s) => (s.points && (s.points[lang] || s.points.fr)) || [];

  return (
    <section className="hero-split" aria-label="Présentation du diocèse">

      {/* ── LEFT — images ── */}
      <div className="hero-left">
        {slides.map((s, i) => {
          const isActive = i === current;
          const isExit   = i === prev;
          return (
            <div
              key={s.id}
              className={`hero-img-panel${isActive ? " img-active" : isExit ? " img-exit" : " img-hidden"}`}
              aria-hidden={!isActive}
            >
              <img
                src={resolveImg(s.image)}
                alt={getTitle(s)}
                className="hero-img"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="hero-img-overlay" aria-hidden="true" />
              <div className="hero-slide-num" aria-hidden="true">
                <span className="hero-slide-cur">{String(i + 1).padStart(2, "0")}</span>
                <span className="hero-slide-sep" />
                <span className="hero-slide-total">{String(slides.length).padStart(2, "0")}</span>
              </div>
            </div>
          );
        })}

        <button className="hero-img-arrow hero-img-arrow--left"  onClick={handlePrev} aria-label="Précédent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="hero-img-arrow hero-img-arrow--right" onClick={handleNext} aria-label="Suivant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <div className="hero-img-dots" role="tablist">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-img-dot${i === current ? " active" : ""}`}
              onClick={() => handleDot(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Diapositive ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT — text ── */}
      <div className="hero-right">
        <div className="hero-crest-wrap" aria-hidden="true">
          <svg viewBox="0 0 80 96" width="72" height="86">
            <path d="M40 4 L76 18 L76 58 Q76 84 40 92 Q4 84 4 58 L4 18 Z" fill="#8B0000" stroke="#D4AF37" strokeWidth="1.5"/>
            <text x="40" y="48" textAnchor="middle" fill="#D4AF37" fontSize="22" fontFamily="serif">✝</text>
            <text x="40" y="68" textAnchor="middle" fill="#D4AF37" fontSize="5.5" fontFamily="serif" letterSpacing="0.8">ORATE IN VERITATE</text>
          </svg>
        </div>

        {slides.map((s, i) => {
          const isActive = i === current;
          const isExit   = i === prev;
          return (
            <div
              key={s.id}
              className={`hero-text-panel${isActive ? " text-active" : isExit ? " text-exit" : " text-hidden"}`}
              aria-hidden={!isActive}
            >
              <div className="hero-text-badge">{s.badge}</div>
              <h1 className="hero-text-title">
                {getTitle(s).split("\n").map((line, li) => (
                  <span key={li} className="hero-title-line">{line}</span>
                ))}
              </h1>
              <div className="hero-text-divider" aria-hidden="true" />
              <p className="hero-text-desc">{getDesc(s)}</p>
              <ul className="hero-text-points">
                {getPoints(s).map((pt, pi) => (
                  <li key={pi} className="hero-text-point">
                    <span className="hero-point-check" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="hero-text-actions">
                <Link to="/a-propos" className="btn btn--primary">
                  {t("hero_btn1")}
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </Link>
                <Link to="/paroisses" className="btn btn--outline-dark">{t("hero_btn2")}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
