import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage     from "./pages/LoginPage";
import Layout        from "./components/Layout";
import Dashboard     from "./pages/Dashboard";
import HeroPage      from "./pages/HeroPage";
import NewsPage      from "./pages/NewsPage";
import NewsForm      from "./pages/NewsForm";
import ParishesPage  from "./pages/ParishesPage";
import MessagesPage  from "./pages/MessagesPage";
import SettingsPage  from "./pages/SettingsPage";
import UsersPage     from "./pages/UsersPage";

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="admin-loading"><div className="admin-spinner"/></div>;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <Guard>
              <Layout>
                <Routes>
                  <Route index              element={<Dashboard />} />
                  <Route path="hero"        element={<HeroPage />} />
                  <Route path="news"        element={<NewsPage />} />
                  <Route path="news/new"    element={<NewsForm />} />
                  <Route path="news/:id"    element={<NewsForm />} />
                  <Route path="parishes"    element={<ParishesPage />} />
                  <Route path="messages"    element={<MessagesPage />} />
                  <Route path="settings"    element={<SettingsPage />} />
                  <Route path="users"       element={<UsersPage />} />
                  <Route path="*"           element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Guard>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
