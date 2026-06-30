import { useState, useEffect } from "react";
import { API_URL } from "../config";

/**
 * Generic data-fetching hook.
 * Paths like "/api/news" are resolved against VITE_API_URL automatically.
 */
export function useApi(path, fallback = null) {
  // path may be "/api/hero" or "/api/news?limit=4"
  // Strip leading "/api" since API_URL already ends with /api
  const url = API_URL + path.replace(/^\/api/, "");

  const [data, setData]       = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [rev, setRev]         = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => { if (!cancelled) setData(json); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url, rev]);

  return { data, loading, error, reload: () => setRev((r) => r + 1) };
}
