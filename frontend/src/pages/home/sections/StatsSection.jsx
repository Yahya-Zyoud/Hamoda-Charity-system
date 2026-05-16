import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Heart, Activity } from "lucide-react";
import { StatCard } from "../../../components/cards";
import { getStats } from "../../../services/api";

const STAT_SHAPE = [
  { key: "activeVolunteers",    name: "متطوع نشط",          icon: Activity, color: "text-amber-600",   bg: "bg-amber-50"   },
  { key: "totalDonors",         name: "متبرع كريم",          icon: Heart,    color: "text-rose-600",    bg: "bg-rose-50"    },
  { key: "completedProjects",   name: "مشروع منجز",          icon: Briefcase,color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "totalBeneficiaries",  name: "إجمالي المستفيدين",   icon: Users,    color: "text-blue-600",    bg: "bg-blue-50"    },
];

export default function StatsSection() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((data) => {
        if (!data || typeof data !== "object" || Array.isArray(data)) return;
        setStats(
          STAT_SHAPE.map((shape, i) => ({
            id:     shape.key,
            name:   shape.name,
            value:  data[shape.key] ?? 0,
            suffix: "+",
            icon:   shape.icon,
            color:  shape.color,
            bg:     shape.bg,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || stats.length === 0) return null;

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
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
