import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import { resolveImg } from "../utils/imageUrl";

const STATIC_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1548625149-720754952028?w=1600&q=90",
    badge: "DIOCÈSE DE KABGAYI",
    titleFr: "DIOCÈSE\nDE KABGAYI",
    titleEn: "DIOCESE\nOF KABGAYI",
    titleRw: "DIYOSEZI\nYA KABGAYI",
    sloganFr: "Orate in veritate",
    sloganEn: "Orate in veritate",
    sloganRw: "Orate in veritate",
    descFr: "Annoncer l'Évangile, célébrer la Foi et servir chaque personne pour une société réconciliée dans le Christ.",
    descEn: "Proclaiming the Gospel, celebrating the Faith and serving every person for a society reconciled in Christ.",
    descRw: "Gutangaza Ubutumwa Bwiza, gusenga no gukora umuntu wese kugira ngo umuryango uhuze muri Kristu.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&q=90",
    badge: "PASTORALE",
    titleFr: "UNE ÉGLISE\nAU SERVICE DE TOUS",
    titleEn: "A CHURCH\nAT THE SERVICE OF ALL",
    titleRw: "ITORERO\nRISUKURA BOSE",
    sloganFr: "Orate in veritate",
    sloganEn: "Orate in veritate",
    sloganRw: "Orate in veritate",
    descFr: "Le Diocèse de Kabgayi accompagne les fidèles dans leur vie spirituelle, sociale et humaine.",
    descEn: "The Diocese of Kabgayi accompanies the faithful in their spiritual, social and human life.",
    descRw: "Diyosezi ya Kabgayi ifasha abakristu mu buzima bw'ubuzimu, imibereho n'imigenzo.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1543652437-15ae418551d7?w=1600&q=90",
    badge: "ÉDUCATION & CULTURE",
    titleFr: "FORMER LES HOMMES\nÉCLAIRER LES ESPRITS",
    titleEn: "EDUCATING PEOPLE\nENLIGHTENING MINDS",
    titleRw: "GUHUGURA ABANTU\nGUKANGURA IBITEKEREZO",
    sloganFr: "Orate in veritate",
    sloganEn: "Orate in veritate",
    sloganRw: "Orate in veritate",
    descFr: "À travers l'Institut Catholique et l'Imprimerie de Kabgayi, nous investissons dans l'avenir du Rwanda.",
    descEn: "Through the Catholic Institute and Kabgayi Print House, we invest in Rwanda's future.",
    descRw: "Binyuze mu Inshuri Gatolika n'inzego z'ibyapa, tushyira igihugu cy'Rwanda mu gihe kizaza.",
  },
];

const INTERVAL = 6000;
const ANIM = 600;

export default function HeroSlider() {
  const { lang, t } = useLang();
  const { data: apiSlides } = useApi("/api/hero", null);
  const slides = (apiSlides && apiSlides.length > 0) ? apiSlides : STATIC_SLIDES;

  const currentRef = useRef(0);
  const [current, _setCurrent] = useState(0);
  const [prev, setPrev]         = useState(null);
  const [isAnimating, setAnim]  = useState(false);
  const timerRef = useRef(null);

  const setCurrent = (v) => { currentRef.current = v; _setCurrent(v); };

  const transition = useCallback((next) => {
    if (isAnimating || next === currentRef.current) return;
    setAnim(true);
    setPrev(currentRef.current);
    setCurrent(next);
    setTimeout(() => { setPrev(null); setAnim(false); }, ANIM);
  }, [isAnimating]);

  const advance = useCallback(() => {
    transition((currentRef.current + 1) % slides.length);
  }, [slides.length, transition]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL);
  }, [advance]);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const getTitle  = (s) => (lang === "en" ? s.titleEn  : lang === "rw" ? s.titleRw  : s.titleFr)  || s.titleFr  || "";
  const getSlogan = (s) => (lang === "en" ? s.sloganEn : lang === "rw" ? s.sloganRw : s.sloganFr) || "Orate in veritate";
  const getDesc   = (s) => (lang === "en" ? s.descEn   : lang === "rw" ? s.descRw   : s.descFr)   || s.descFr   || "";
  const imgSrc    = (s) => resolveImg(s.image_url || s.image || "");

  const handlePrev = () => { transition((currentRef.current - 1 + slides.length) % slides.length); resetTimer(); };
  const handleNext = () => { transition((currentRef.current + 1) % slides.length); resetTimer(); };

  return (
    <section className="hero-fw" aria-label="Présentation du diocèse">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-fw-bg${i === current ? " active" : ""}${i === prev ? " exit" : ""}`}
          style={{ backgroundImage: `url(${imgSrc(s)})` }}
          aria-hidden="true"
        />
      ))}

      {/* Gradient overlay */}
      <div className="hero-fw-overlay" aria-hidden="true" />

      {/* Text content — overlaid bottom-left */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-fw-content${i === current ? " active" : ""}${i === prev ? " exit" : ""}`}
          aria-hidden={i !== current}
        >
          <h1 className="hero-fw-title">
            {getTitle(s).split("\n").map((line, li) => (
              <span key={li} className="hero-fw-title-line">{line}</span>
            ))}
          </h1>
          <p className="hero-fw-slogan">{getSlogan(s)}</p>
          <p className="hero-fw-desc">{getDesc(s)}</p>
          <div className="hero-fw-actions">
            <Link to="/a-propos" className="hero-fw-btn">
              {lang === "fr" ? "Découvrir le Diocèse" : lang === "en" ? "Discover the Diocese" : "Menya Diyosezi"}
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
        </div>
      ))}

      {/* Left arrow */}
      <button className="hero-fw-arrow hero-fw-arrow--left" onClick={handlePrev} aria-label="Précédent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Right arrow */}
      <button className="hero-fw-arrow hero-fw-arrow--right" onClick={handleNext} aria-label="Suivant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="hero-fw-dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-fw-dot${i === current ? " active" : ""}`}
            onClick={() => { transition(i); resetTimer(); }}
            role="tab"
            aria-selected={i === current}
            aria-label={`Diapositive ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
