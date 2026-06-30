import { API_URL } from "../config";

const BASE = API_URL;

function getToken() {
  return localStorage.getItem("admin_token");
}

function headers() {
  const h = { "Content-Type": "application/json" };
  const t = getToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login:          (b)    => request("POST", "/auth/login", b),
  me:             ()     => request("GET",  "/auth/me"),
  changePassword: (b)    => request("PUT",  "/auth/password", b),

  // Image upload — multipart/form-data (not JSON)
  uploadImage: async (file) => {
    const fd    = new FormData();
    fd.append("image", file);
    const token = getToken();
    const res   = await fetch(`${BASE}/upload`, {
      method:  "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body:    fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data; // { url, filename, size }
  },
  deleteUpload: (filename) => request("DELETE", "/upload", { filename }),

  // Hero slides
  getHeroSlides:  ()     => request("GET",  "/hero/all"),
  createSlide:    (b)    => request("POST", "/hero", b),
  updateSlide:    (id,b) => request("PUT",  `/hero/${id}`, b),
  deleteSlide:    (id)   => request("DELETE",`/hero/${id}`),
  toggleSlide:    (id)   => request("PATCH",`/hero/${id}/toggle`),

  // News
  getAllNews:     ()     => request("GET",  "/news/all"),
  getNews:       (id)   => request("GET",  `/news/${id}`),
  createNews:    (b)    => request("POST", "/news", b),
  updateNews:    (id,b) => request("PUT",  `/news/${id}`, b),
  deleteNews:    (id)   => request("DELETE",`/news/${id}`),

  // Parishes
  getAllParishes: ()     => request("GET",  "/parishes/all"),
  createParish:  (b)    => request("POST", "/parishes", b),
  updateParish:  (id,b) => request("PUT",  `/parishes/${id}`, b),
  deleteParish:  (id)   => request("DELETE",`/parishes/${id}`),

  // Settings
  getSettings:   ()     => request("GET",  "/settings"),
  saveSettings:  (b)    => request("PUT",  "/settings", b),

  // Contact messages
  getMessages:   ()     => request("GET",  "/contact"),
  markRead:      (id)   => request("PATCH",`/contact/${id}/read`),
  deleteMessage: (id)   => request("DELETE",`/contact/${id}`),

  // Users
  getUsers:      ()     => request("GET",  "/users"),
  createUser:    (b)    => request("POST", "/users", b),
  updateUser:    (id,b) => request("PUT",  `/users/${id}`, b),
  deleteUser:    (id)   => request("DELETE",`/users/${id}`),
};
