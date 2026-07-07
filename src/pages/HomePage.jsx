import HeroSlider        from "../components/HeroSlider";
import StatsBar          from "../components/StatsBar";
import NewsSection       from "../components/NewsSection";
import QuickAccess       from "../components/QuickAccess";
import HomeBottomSection from "../components/HomeBottomSection";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSlider />
      <StatsBar />
      <NewsSection />
      <QuickAccess />
      <HomeBottomSection />
    </main>
  );
}
