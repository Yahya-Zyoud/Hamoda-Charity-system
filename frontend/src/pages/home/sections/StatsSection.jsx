import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Heart, Activity } from "lucide-react";
import { StatCard } from "../../../components/cards";
import { getStats } from "../../../services/api";

const ICON_MAP = { Users, Briefcase, Heart, Activity };
const COLOR_MAP = [
  { color: "text-blue-600",    bg: "bg-blue-50" },
  { color: "text-emerald-600", bg: "bg-emerald-50" },
  { color: "text-rose-600",    bg: "bg-rose-50" },
  { color: "text-amber-600",   bg: "bg-amber-50" },
];

const FALLBACK = [
  { id: 1, name: "إجمالي المستفيدين", value: 50430, suffix: "+", icon: Users,    ...COLOR_MAP[0] },
  { id: 2, name: "مشروع منجز",        value: 1250,  suffix: "+", icon: Briefcase,...COLOR_MAP[1] },
  { id: 3, name: "متبرع كريم",         value: 8300,  suffix: "+", icon: Heart,    ...COLOR_MAP[2] },
  { id: 4, name: "متطوع نشط",          value: 340,   suffix: "+", icon: Activity, ...COLOR_MAP[3] },
];

export default function StatsSection() {
  const [stats, setStats] = useState(FALLBACK);

  useEffect(() => {
    getStats()
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        setStats(
          data.map((s, i) => ({
            id:     s._id || i,
            name:   s.label,
            value:  s.value,
            suffix: s.suffix || "+",
            icon:   ICON_MAP[s.icon] || Activity,
            ...(COLOR_MAP[i % COLOR_MAP.length]),
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="stats"
      dir="rtl"
      className="relative z-40 -mt-12 sm:-mt-16 md:-mt-24 w-full px-4 mb-16"
      style={{ fontFamily: '"Cairo", sans-serif' }}
    >
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-full bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-white/60 p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4 relative overflow-hidden group"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-500/5 via-emerald-500/5 to-rose-500/5 blur-3xl pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
