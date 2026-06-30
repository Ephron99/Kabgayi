import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import TopBar        from "./components/TopBar";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import HomePage      from "./pages/HomePage";
import AboutPage     from "./pages/AboutPage";
import GenericPage   from "./pages/GenericPage";
import ParoissesPage from "./pages/ParoissesPage";
import ActualitesPage from "./pages/ActualitesPage";
import NewsDetailPage  from "./pages/NewsDetailPage";
import VieConsacreePage from "./pages/VieConsacreePage";
import ContactPage   from "./pages/ContactPage";
import MaintenancePage from "./pages/MaintenancePage";
import AdminApp      from "./admin/AdminApp";
import "./App.css";

const MAINTENANCE_MODE = true; // ← flip to false to bring the site back

function PublicLayout({ children }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <TopBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function PublicSite() {
  return (
    <LanguageProvider>
      <PublicLayout>
        <Routes>
          <Route path="/"                       element={MAINTENANCE_MODE ? <MaintenancePage /> : <HomePage />} />
          <Route path="/home"                   element={<HomePage />} />
          <Route path="/a-propos"               element={<AboutPage />} />
          <Route path="/services"               element={<GenericPage section="services" />} />
          <Route path="/services/:slug"         element={<GenericPage section="services" />} />
          <Route path="/pastorale"              element={<GenericPage section="pastorale" />} />
          <Route path="/pastorale/:slug"        element={<GenericPage section="pastorale" />} />
          <Route path="/paroisses"              element={<ParoissesPage />} />
          <Route path="/paroisses/:id"          element={<ParoissesPage />} />
          <Route path="/vie-consacree"          element={<VieConsacreePage />} />
          <Route path="/actualites"             element={<ActualitesPage />} />
          <Route path="/actualites/:id"         element={<NewsDetailPage />} />
          <Route path="/documentation"          element={<GenericPage section="documentation" />} />
          <Route path="/documentation/:slug"    element={<GenericPage section="documentation" />} />
          <Route path="/liturgie"               element={<GenericPage section="liturgie" />} />
          <Route path="/liturgie/:slug"         element={<GenericPage section="liturgie" />} />
          <Route path="/contact"                element={<ContactPage />} />
          <Route path="*"                       element={<HomePage />} />
        </Routes>
      </PublicLayout>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Maintenance page — no navbar/footer */}
        {MAINTENANCE_MODE && (
          <Route path="/" element={<MaintenancePage />} />
        )}

        {/* Full public site, with chrome */}
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}