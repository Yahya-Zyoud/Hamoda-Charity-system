import { motion } from "framer-motion";
import { MapPin, Users, Calendar, CheckCircle2, Clock, Timer, FolderOpen } from "lucide-react";

const CATEGORY_COLORS = {
  "صحة":          { bg: "rgba(7,202,107,0.15)",   text: "#059669" },
  "تعليم":        { bg: "rgba(24,86,255,0.15)",   text: "#1856FF" },
  "إغاثة":        { bg: "rgba(239,68,68,0.15)",   text: "#dc2626" },
  "بنية تحتية":   { bg: "rgba(245,158,11,0.15)",  text: "#d97706" },
  "دعم نفسي":     { bg: "rgba(139,92,246,0.15)",  text: "#7c3aed" },
  "تدريب":        { bg: "rgba(20,184,166,0.15)",  text: "#0d9488" },
  "رعاية":        { bg: "rgba(236,72,153,0.15)",  text: "#be185d" },
  "إسكان":        { bg: "rgba(100,116,139,0.15)", text: "#475569" },
  "أخرى":         { bg: "rgba(100,116,139,0.15)", text: "#475569" },
};

const STATUS_CONFIG = {
  "نشط":          { label: "نشط",          Icon: Timer,        bg: "#22c55e", dot: true  },
  "مكتمل":        { label: "مكتمل",        Icon: CheckCircle2, bg: "#3b82f6", dot: false },
  "قيد التخطيط":  { label: "قيد التخطيط",  Icon: Clock,        bg: "#f59e0b", dot: false },
};

const PROGRESS_GRADIENTS = [
  "linear-gradient(90deg, #1856FF, #07CA6B)",
  "linear-gradient(90deg, #0ea5e9, #1856FF)",
  "linear-gradient(90deg, #07CA6B, #0ea5e9)",
  "linear-gradient(90deg, #8b5cf6, #1856FF)",
  "linear-gradient(90deg, #f59e0b, #ef4444)",
];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long" });
}

export default function ProjectCard({ project, index = 0 }) {
  const cat      = CATEGORY_COLORS[project.category] || CATEGORY_COLORS["أخرى"];
  const status   = STATUS_CONFIG[project.status]     || STATUS_CONFIG["قيد التخطيط"];
  const progress = project.goal
    ? Math.min(Math.round(((project.raised || 0) / project.goal) * 100), 100)
    : 0;
  const gradient = PROGRESS_GRADIENTS[index % PROGRESS_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(24,86,255,0.13)" }}
      className="rounded-2xl overflow-hidden flex flex-col bg-white"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.22s, box-shadow 0.22s",
      }}
    >
      {/* ── الصورة ────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#dbeafe,#bbf7d0)" }}
          >
            <FolderOpen size={48} color="#1856FF" opacity={0.4} />
          </div>
        )}

        {/* Category badge — أعلى اليمين */}
        <span
          className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: cat.bg, color: cat.text }}
        >
          {project.category}
        </span>

        {/* Status badge — أعلى اليسار */}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background: status.bg }}
        >
          {status.dot && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
          )}
          <status.Icon size={11} />
          {status.label}
        </span>
      </div>

      {/* ── المحتوى ───────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1" dir="rtl">

        {/* العنوان */}
        <h3 className="text-base font-extrabold mb-2 leading-snug" style={{ color: "#0f172a" }}>
          {project.title}
        </h3>

        {/* الوصف */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#64748b" }}>
          {project.description}
        </p>

        {/* ── شريط التقدم ─────────────────────────────────── */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold" style={{ color: "#1856FF" }}>
              نسبة الإنجاز
            </span>
            <span className="text-xs font-extrabold" style={{ color: "#1856FF" }}>
              {progress}%
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "8px", background: "#e2e8f0" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, delay: index * 0.07 + 0.2, ease: "easeOut" }}
              style={{ height: "100%", background: gradient, borderRadius: "9999px" }}
            />
          </div>
        </div>

        {/* ── التفاصيل ─────────────────────────────────────── */}
        <div
          className="flex flex-col gap-2 mb-5 pt-3"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          {project.location && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
              <MapPin size={13} color="#1856FF" />
              <span>الموقع: {project.location}</span>
            </div>
          )}
          {project.beneficiaries > 0 && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
              <Users size={13} color="#1856FF" />
              <span>المستفيدين: {project.beneficiaries.toLocaleString("ar-EG")}</span>
            </div>
          )}
          {project.startDate && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
              <Calendar size={13} color="#1856FF" />
              <span>تاريخ البدء: {formatDate(project.startDate)}</span>
            </div>
          )}
        </div>

        {/* ── زر عرض التفاصيل ──────────────────────────────── */}
        <button
          className="mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1856FF, #07CA6B)",
            color: "white",
            boxShadow: "0 4px 14px rgba(24,86,255,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          عرض التفاصيل
        </button>
      </div>
    </motion.div>
  );
}