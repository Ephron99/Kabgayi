import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LanguageContext";

const stats = [
  {
    value: 650000, suffix: "+", key: "stat_catholics",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: "#1A56DB",
  },
  {
    value: 31, suffix: "", key: "stat_parishes",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    color: "#D4AF37",
  },
  {
    value: 153, suffix: "", key: "stat_communities",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: "#1A56DB",
  },
  {
    value: 78, suffix: "", key: "stat_priests",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><line x1="12" y1="2" x2="12" y2="22"/><line x1="6" y1="8" x2="18" y2="8"/></svg>,
    color: "#E74C3C",
  },
];

function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

function StatItem({ stat, active }) {
  const { t } = useLang();
  const count = useCountUp(stat.value, active);
  const display = stat.value >= 1000
    ? (count >= 1000 ? (count / 1000).toFixed(0) + " 000" : count.toLocaleString())
    : count.toLocaleString();

  return (
    <div className="stat-v2-item">
      <div className="stat-v2-icon" style={{ color: stat.color }}>{stat.icon}</div>
      <div className="stat-v2-number" style={{ color: stat.color }}>
        {display}{stat.suffix}
      </div>
      <div className="stat-v2-label">{t(stat.key)}</div>
    </div>
  );
}

export default function StatsBar() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stats-v2" ref={ref}>
      <div className="stats-v2-card">
        {stats.map((s) => (
          <StatItem key={s.key} stat={s} active={active} />
        ))}
      </div>
    </div>
  );
}
