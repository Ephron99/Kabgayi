import { useState, useEffect } from "react";

/**
 * Generic data-fetching hook.
 * Returns { data, loading, error, reload }
 * Falls back to `fallback` if the request fails.
 */
export function useApi(url, fallback = null) {
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
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          // keep fallback data intact on error
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url, rev]);

  return { data, loading, error, reload: () => setRev((r) => r + 1) };
}
