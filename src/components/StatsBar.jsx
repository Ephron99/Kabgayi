import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { Users, Church, Handshake, Cross } from "lucide-react";
const stats = [
  { value: 402, suffix: "+", key: "stat_catholics", icon: Users },
  { value: 47, suffix: "", key: "stat_parishes", icon: Church },
  { value: 128, suffix: "", key: "stat_communities", icon: Handshake },
  { value: 78, suffix: "", key: "stat_priests", icon: Cross },
];

function useCountUp(target, duration = 2000, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatItem({ stat, active }) {
  const { t } = useLang();
  const count = useCountUp(stat.value, 2000, active);
  const Icon = stat.icon;

  return (
    <div className="stat-item">
      <div className="stat-icon" aria-hidden="true">
        <Icon size={32} strokeWidth={1.8} />
      </div>
      <div className="stat-number">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="stat-label">{t(stat.key)}</div>
    </div>
  );
}

export default function StatsBar() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-bar" ref={ref} aria-label="Statistiques du diocèse">
      {stats.map((stat) => (
        
        <StatItem key={stat.key} stat={stat} active={active} />
      ))}
    </div>
  );
}
