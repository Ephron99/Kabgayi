import { useLang } from "../context/LanguageContext";
import { useApi } from "../hooks/useApi";
import eveque from '../assets/portrait_eveque_-_copy_2_-9a431.jpg'; 
const BACKEND = "http://localhost:5000";
const resolveUrl = (url) => (!url ? null : url.startsWith("http") ? url : `${BACKEND}${url}`);

const FALLBACK_PHOTO = eveque;

const bishopMessage = {
  fr: `Ce site web du Diocèse de Kabgayi est un instrument pastoral de grande importance. Il a pour rôle de renforcer la communion et de faciliter la communication avec les autres Églises au Rwanda et ailleurs.

L'arrière-fond du site sera toujours la mise en pratique de la Nouvelle Évangélisation que nous recommande le Pape François dans son Encyclique « Evangelii Gaudium ».

Le Diocèse de Kabgayi, à travers son site web, se sentira comme une famille qui s'écoute et qui veut bien communier ses joies et ses préoccupations pastorales, à la lumière du Christ, Notre Espérance.

Que la Vierge Marie Immaculée Conception, Patronne du Diocèse, prie pour nous, afin que le règne du Christ se réalise davantage.`,
  en: `This website of the Diocese of Kabgayi is a pastoral instrument of great importance. Its role is to strengthen communion and facilitate communication with other Churches in Rwanda and beyond.

The background of the site will always be the implementation of the New Evangelization recommended by Pope Francis in his Encyclical "Evangelii Gaudium".

The Diocese of Kabgayi, through its website, will feel like a family that listens and wants to share its joys and pastoral concerns, in the light of Christ, Our Hope.

May the Immaculate Virgin Mary, Patroness of the Diocese, pray for us, so that the reign of Christ may be realized more and more.`,
  rw: `Urubuga rwa Diyosezi ya Kabgayi ni igikoresho cy'ubutumwa cy'ingenzi cyane. Inshingano yarwo ni ugushyira hamwe imibereho no gutumanahana n'Amatorero yandi muri Rwanda no ahandi.

Inshingano y'urubuga igomba kuba uyushyira mu bikorwa Evanjilizasiyoni Nshya Papa Fransisko yadutegetse mu Inkoranyamagambo ye "Evangelii Gaudium".

Diyosezi ya Kabgayi, binyuze ku rubuga rwayo, izagaragara nk'umuryango wumva kandi ushaka kwegeranya ibyishimo n'ibibazo by'ubutumwa, mu rumuri rwa Kristu, Icyizere Cyacu.

Bikiristu bikubiye mu Bikiristu Bikiristu bikubiye muri Bikiristu.`,
};

export default function BishopSection() {
  const { t, lang } = useLang();
  const { data: settings } = useApi("/api/settings", {});
  const bishopPhoto = resolveUrl(settings?.bishop_photo) || FALLBACK_PHOTO;
  const bishopName  = settings?.bishop_name  || t("bishop_name");
  const bishopRole  = settings?.bishop_role_fr || t("bishop_role");

  return (
    <section className="bishop-section" aria-labelledby="bishop-heading">
      <div className="bishop-inner">
        {/* Bishop card */}
        <div className="bishop-card">
          <div className="bishop-photo-wrap">
            <img
              src={bishopPhoto}
              alt={bishopName}
              className="bishop-photo"
              width="340"
              height="420"
              loading="lazy"
            />
            <div className="bishop-photo-badge">
              <span className="bishop-cross" aria-hidden="true">✝</span>
            </div>
          </div>
          <div className="bishop-info">
            <div className="bishop-signature" aria-hidden="true">
              <svg viewBox="0 0 200 60" width="180" height="50">
                <path d="M10 40 Q40 10 80 35 Q120 55 160 20 Q180 10 190 30" fill="none" stroke="#8B0000" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="bishop-name">{bishopName}</h3>
            <p className="bishop-role">{bishopRole}</p>
          </div>
        </div>

        {/* Message */}
        <div className="bishop-message">
          <div className="section-label" aria-hidden="true">{t("bishop_title")}</div>
          <h2 id="bishop-heading" className="bishop-message-title">{t("bishop_subtitle")}</h2>
          <div className="bishop-divider" aria-hidden="true"></div>
          <div className="bishop-text">
            {(bishopMessage[lang] || bishopMessage.fr).split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Live + Newsletter */}
        <aside className="bishop-aside">
          {/* Radio */}
          <div className="live-card">
            <div className="live-card-header">
              <span className="live-badge">
                <span className="live-dot" aria-hidden="true"></span>
                {t("live_label")}
              </span>
              <span className="live-card-title">{t("live_radio")}</span>
            </div>
            <div className="live-card-brand">Radio Maria Rwanda</div>
            <button className="live-play-btn" aria-label="Écouter Radio Maria Rwanda">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="live-waveform" aria-hidden="true">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s`, height: `${8 + Math.sin(i) * 10}px` }} />
              ))}
            </div>
          </div>

          {/* TV */}
          <div className="live-card live-card--tv">
            <div className="live-card-header">
              <span className="live-badge">
                <span className="live-dot" aria-hidden="true"></span>
                {t("live_label")}
              </span>
              <span className="live-card-title">{t("live_tv")}</span>
            </div>
            <div className="live-card-brand">Pacis TV</div>
            <button className="live-play-btn" aria-label="Regarder Pacis TV">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          {/* Newsletter */}
          <div className="newsletter-card">
            <div className="newsletter-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h4 className="newsletter-title">{t("newsletter_title")}</h4>
            <p className="newsletter-sub">{t("newsletter_sub")}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("newsletter_placeholder")}
                className="newsletter-input"
                aria-label={t("newsletter_placeholder")}
                required
              />
              <button type="submit" className="newsletter-btn">{t("newsletter_btn")}</button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
