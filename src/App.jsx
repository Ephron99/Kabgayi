import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import TopBar        from "./components/TopBar";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import HomePage      from "./pages/HomePage";
import AboutPage     from "./pages/AboutPage";
import GenericPage   from "./pages/GenericPage";
import ParoissesPage from "./pages/ParoissesPage";
import ParishDetailPage from "./pages/ParishDetailPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ActualitesPage from "./pages/ActualitesPage";
import NewsDetailPage  from "./pages/NewsDetailPage";
import VieConsacreePage from "./pages/VieConsacreePage";
import ContactPage   from "./pages/ContactPage";
import MaintenancePage from "./pages/MaintenancePage";
import PastoralDetailPage from "./pages/PastoralDetailPage";
import AdminApp      from "./admin/AdminApp";
import "./App.css";

const MAINTENANCE_MODE = true; // ← set to true for maintenance, false to bring site back

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
          <Route path="/"                       element={<HomePage />} />
          <Route path="/home"                   element={<HomePage />} />
          <Route path="/a-propos"               element={<AboutPage />} />
          <Route path="/services"              element={<GenericPage section="services" />} />
          <Route path="/services/:slug"          element={<ServiceDetailPage />} />
          <Route path="/education"              element={<GenericPage section="education" />} />
          <Route path="/education/:slug"        element={<GenericPage section="education" />} />
          <Route path="/pastorale"              element={<GenericPage section="pastorale" />} />
          <Route path="/pastorale/:slug"        element={<PastoralDetailPage />} />
          <Route path="/paroisses"              element={<ParoissesPage />} />
          <Route path="/paroisses/:id"          element={<ParishDetailPage />} />
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

        {MAINTENANCE_MODE && (
          <>
            <Route path="/" element={<MaintenancePage />} />
            <Route path="/home" element={<MaintenancePage />} />
          </>
        )}

        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}