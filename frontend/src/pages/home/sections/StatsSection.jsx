// Animated stats strip on the home page; retries the API up to 3 times and shows skeletons while loading.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Heart, Activity } from "lucide-react";
import { StatCard } from "../../../components/cards";
import { getStats } from "../../../services/api";

/**
 * Display config lives here — backend only returns plain numbers.
 * Reorder or rename by editing this array, zero backend changes needed.
 */
const STATS_CONFIG = [
  { key: "beneficiaries", icon: Users,     label: "إجمالي المستفيدين", suffix: "+", color: "text-blue-600",    bg: "bg-blue-50"    },
  { key: "projects",      icon: Briefcase, label: "مشروع منجز",        suffix: "+", color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "donors",        icon: Heart,     label: "متبرع كريم",         suffix: "+", color: "text-rose-600",    bg: "bg-rose-50"    },
  { key: "team",          icon: Activity,  label: "متطوع نشط",          suffix: "+", color: "text-amber-600",   bg: "bg-amber-50"   },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center justify-center text-center relative z-10 animate-pulse">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-slate-200 mb-6" />
      <div className="h-10 w-24 bg-slate-200 rounded-lg mb-3" />
      <div className="h-4 w-20 bg-slate-100 rounded-lg" />
    </div>
  );
}

export default function StatsSection() {
  const [data,    setData]    = useState(null);  // null = loading, {} = loaded
  const [failed,  setFailed]  = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = (attempt = 1) => {
      getStats()
        .then((res) => {
          if (cancelled) return;
          // Backend now returns a plain object { donors, projects, beneficiaries, team, totalAmount }
          if (res && typeof res === "object" && !Array.isArray(res)) {
            setData(res);
          } else {
            setFailed(true);
          }
        })
        .catch(() => {
          if (cancelled) return;
          if (attempt < 4) {
            setTimeout(() => load(attempt + 1), attempt * 3000);
          } else {
            setFailed(true);
          }
        });
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const stats = STATS_CONFIG.map((cfg) => ({
    ...cfg,
    value: data?.[cfg.key] ?? 0,
  }));

  // Don't render the section at all if load permanently failed with 0s everywhere
  if (failed && stats.every((s) => s.value === 0)) return null;

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

          {data === null
            ? STATS_CONFIG.map((_, i) => <SkeletonCard key={i} />)
            : stats.map((stat, index) => (
                <StatCard key={stat.key} stat={stat} index={index} />
              ))
          }
        </motion.div>
      </div>
    </section>
  );
}
