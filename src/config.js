// Central config — reads from environment variables
export const API_URL = import.meta.env.VITE_API_URL || "https://localhost:5000/api";
export const BACKEND_BASE = API_URL.replace("/api", "");
