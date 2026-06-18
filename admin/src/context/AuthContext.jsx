import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setLoading(false); return; }
    api.me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem("admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user: u } = await api.login({ email, password });
    localStorage.setItem("admin_token", token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
