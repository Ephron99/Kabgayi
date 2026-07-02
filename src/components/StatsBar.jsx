import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { Users, Church, HeartHandshake, Cross } from "lucide-react";

const stats = [
  { value: 650000, suffix: "+", key: "stat_catholics",   Icon: Users,          color: "#1A56DB" },
  { value: 31,     suffix: "",  key: "stat_parishes",    Icon: Church,         color: "#D4AF37" },
  { value: 153,    suffix: "",  key: "stat_communities", Icon: HeartHandshake, color: "#1A56DB" },
  { value: 78,     suffix: "",  key: "stat_priests",     Icon: Cross,          color: "#E74C3C" },
];

function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (2000 / 16));
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
  const display = count >= 1000
    ? Math.floor(count / 1000).toLocaleString() + " 000"
    : count.toLocaleString();

  return (
    <div className="stat-v2-item">
      <div className="stat-v2-icon" style={{ color: stat.color }}>
        <stat.Icon size={32} strokeWidth={1.6} />
      </div>
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
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
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
