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
import VieConsacreePage from "./pages/VieConsacreePage";
import ContactPage   from "./pages/ContactPage";
import AdminApp      from "./admin/AdminApp";
import "./App.css";

/** Public layout wrapper — topbar + navbar + footer */
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Admin portal — no public chrome ── */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* ── Public website ── */}
        <Route path="/*" element={
          <LanguageProvider>
            <PublicLayout>
              <Routes>
                <Route path="/"                       element={<HomePage />} />
                <Route path="/a-propos"               element={<AboutPage />} />
                <Route path="/services"               element={<GenericPage section="services" />} />
                <Route path="/services/:slug"         element={<GenericPage section="services" />} />
                <Route path="/pastorale"              element={<GenericPage section="pastorale" />} />
                <Route path="/pastorale/:slug"        element={<GenericPage section="pastorale" />} />
                <Route path="/paroisses"              element={<ParoissesPage />} />
                <Route path="/paroisses/:id"          element={<ParoissesPage />} />
                <Route path="/vie-consacree"          element={<VieConsacreePage />} />
                <Route path="/actualites"             element={<ActualitesPage />} />
                <Route path="/actualites/:id"         element={<ActualitesPage />} />
                <Route path="/documentation"          element={<GenericPage section="documentation" />} />
                <Route path="/documentation/:slug"   element={<GenericPage section="documentation" />} />
                <Route path="/liturgie"               element={<GenericPage section="liturgie" />} />
                <Route path="/liturgie/:slug"         element={<GenericPage section="liturgie" />} />
                <Route path="/contact"                element={<ContactPage />} />
                <Route path="*"                       element={<HomePage />} />
              </Routes>
            </PublicLayout>
          </LanguageProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}
