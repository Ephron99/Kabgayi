import { BACKEND_BASE } from "../config";

/** Resolve a stored image URL — handles both external URLs and local uploads */
export function resolveImg(url) {
  if (!url) return "";
  if (url.startsWith("https://") || url.startsWith("https://")) return url;
  return `${BACKEND_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
