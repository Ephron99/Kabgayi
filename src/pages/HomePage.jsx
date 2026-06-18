import HeroSlider from "../components/HeroSlider";
import StatsBar from "../components/StatsBar";
import BishopSection from "../components/BishopSection";
import NewsSection from "../components/NewsSection";
import ParishesSection from "../components/ParishesSection";
import ValuesSection from "../components/ValuesSection";
import CTASection from "../components/CTASection";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSlider />
      <StatsBar />
      <BishopSection />
      <NewsSection />
      <ParishesSection />
      <ValuesSection />
      <CTASection />
    </main>
  );
}
