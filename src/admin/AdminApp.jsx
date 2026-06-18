import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { AdminLangProvider } from "./context/AdminLangContext";
import Layout      from "./components/Layout";
import LoginPage   from "./pages/LoginPage";
import Dashboard   from "./pages/Dashboard";
import HeroPage    from "./pages/HeroPage";
import NewsPage    from "./pages/NewsPage";
import NewsForm    from "./pages/NewsForm";
import ParishesPage from "./pages/ParishesPage";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage   from "./pages/UsersPage";
import "./admin.css";

function Guard({ children }) {
  const { user, loading } = useAdminAuth();
  if (loading) return (
    <div className="admin-loading">
      <div className="admin-spinner" />
    </div>
  );
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function AdminRoutes() {
  return (
    <Routes>
      {/* Login — no layout */}
      <Route path="login" element={<LoginPage />} />

      {/* All other admin pages use Layout */}
      <Route path="*" element={
        <Guard>
          <Layout>
            <Routes>
              <Route index            element={<Dashboard />} />
              <Route path="hero"      element={<HeroPage />} />
              <Route path="news"      element={<NewsPage />} />
              <Route path="news/new"  element={<NewsForm />} />
              <Route path="news/:id"  element={<NewsForm />} />
              <Route path="parishes"  element={<ParishesPage />} />
              <Route path="messages"  element={<MessagesPage />} />
              <Route path="settings"  element={<SettingsPage />} />
              <Route path="users"     element={<UsersPage />} />
              <Route path="*"         element={<Navigate to="/admin" replace />} />
            </Routes>
          </Layout>
        </Guard>
      } />
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <AdminLangProvider>
      <AdminAuthProvider>
        <AdminRoutes />
      </AdminAuthProvider>
    </AdminLangProvider>
  );
}
