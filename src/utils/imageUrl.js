/** Resolve a stored image URL — handles both external URLs and local uploads */
const BACKEND = "http://localhost:5000";

export function resolveImg(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND}${url.startsWith("/") ? "" : "/"}${url}`;
}
