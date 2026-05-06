import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, Calendar, CheckCircle2, Clock, Timer,
  FolderOpen, ChevronDown, Heart, Target,
  TrendingUp, Info, X,
} from "lucide-react";
import { createPortal } from "react-dom";

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
  "نشط":         { label: "نشط",         Icon: Timer,        bg: "#22c55e", dot: true  },
  "مكتمل":       { label: "مكتمل",       Icon: CheckCircle2, bg: "#3b82f6", dot: false },
  "قيد التخطيط": { label: "قيد التخطيط", Icon: Clock,        bg: "#f59e0b", dot: false },
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
  return new Date(dateStr).toLocaleDateString("ar-EG", { year: "numeric", month: "long" });
}

function formatCurrency(n) {
  if (!n) return "—";
  return n.toLocaleString("ar-EG") + " ₪";
}

// ── Modal Overlay ──────────────────────────────────────────────────────────────
function ProjectModal({ project, gradient, progress, onClose, onDonate }) {
  const cat    = CATEGORY_COLORS[project.category] || CATEGORY_COLORS["أخرى"];
  const status = STATUS_CONFIG[project.status]     || STATUS_CONFIG["قيد التخطيط"];

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const modal = (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(15,23,42,0.65)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.88, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
          style={{
            zIndex: 9999,
            background: "white",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 32px 80px rgba(24,86,255,0.22), 0 8px 32px rgba(0,0,0,0.15)",
            scrollbarWidth: "thin",
          }}
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden" style={{ borderRadius: "24px 24px 0 0" }}>
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#dbeafe,#bbf7d0)" }}
              >
                <FolderOpen size={48} color="#1856FF" opacity={0.4} />
              </div>
            )}

            <span
              className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: cat.bg, color: cat.text }}
            >
              {project.category}
            </span>

            <span
              className="absolute top-3 left-12 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: status.bg }}
            >
              {status.dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              )}
              <status.Icon size={11} />
              {status.label}
            </span>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 flex items-center justify-center rounded-full transition-all"
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(15,23,42,0.55)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-4">
            <h3 className="text-lg font-extrabold leading-snug" style={{ color: "#0f172a" }}>
              {project.title}
            </h3>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold" style={{ color: "#1856FF" }}>نسبة الإنجاز</span>
                <span className="text-xs font-extrabold" style={{ color: "#1856FF" }}>{progress}%</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: "8px", background: "#e2e8f0" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  style={{ height: "100%", background: gradient, borderRadius: "9999px" }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>
                {progress < 30 && "نحتاج دعمك لاستكمال هذا المشروع 🤝"}
                {progress >= 30 && progress < 70 && "المشروع يسير بخطى جيدة، واصل الدعم 💪"}
                {progress >= 70 && progress < 100 && "اقتربنا من الهدف، ساهم معنا للإنهاء 🎯"}
                {progress === 100 && "تم اكتمال التمويل بنجاح ✅"}
              </p>
            </div>

            {/* Full description */}
            <div
              className="rounded-2xl p-4 flex gap-2"
              style={{ background: "#f8faff", border: "1px solid #e0e7ff" }}
            >
              <Info size={15} color="#1856FF" className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: "#1856FF" }}>الوصف الكامل</p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  {project.description}
                </p>
              </div>
            </div>

            {/* Financial goal */}
            {project.goal > 0 && (
              <div
                className="rounded-2xl p-4 flex gap-2"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <Target size={15} color="#07CA6B" className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold mb-2" style={{ color: "#059669" }}>
                    التمويل المطلوب
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "الهدف",   val: formatCurrency(project.goal)   },
                      { label: "تم جمعه", val: formatCurrency(project.raised) },
                      { label: "المتبقي", val: formatCurrency((project.goal || 0) - (project.raised || 0)) },
                    ].map(({ label, val }) => (
                      <div
                        key={label}
                        className="rounded-xl py-2 px-1"
                        style={{ background: "white", border: "1px solid #e2e8f0" }}
                      >
                        <p className="text-xs font-extrabold" style={{ color: "#0f172a" }}>{val}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Details */}
            <div
              className="flex flex-col gap-2 pt-3"
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

            {/* Donate button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDonate}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #1856FF 0%, #07CA6B 100%)",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(24,86,255,0.35)",
              }}
            >
              <Heart size={16} className="fill-white" />
              تبرع الآن
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

// ── الكارد الرئيسي ─────────────────────────────────────────────────────────────
export default function ProjectCard({ project, index = 0, expandedId, setExpandedId }) {
  const isExpanded = expandedId === (project._id || index);

  const cat      = CATEGORY_COLORS[project.category] || CATEGORY_COLORS["أخرى"];
  const status   = STATUS_CONFIG[project.status]     || STATUS_CONFIG["قيد التخطيط"];
  const progress = project.goal
    ? Math.min(Math.round(((project.raised || 0) / project.goal) * 100), 100)
    : 0;
  const gradient = PROGRESS_GRADIENTS[index % PROGRESS_GRADIENTS.length];

  const toggleExpand = () =>
    setExpandedId(isExpanded ? null : (project._id || index));

  const handleDonate = () => {
    alert(`شكراً لك! سيتم توجيهك لصفحة التبرع لمشروع: ${project.title}`);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, delay: index * 0.07 }}
        className="rounded-2xl overflow-hidden flex flex-col bg-white"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.3s",
        }}
      >
        {/* ── الصورة ──────────────────────────────────────────────────────────── */}
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

          <span
            className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: cat.bg, color: cat.text }}
          >
            {project.category}
          </span>

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

        {/* ── المحتوى الأساسي ─────────────────────────────────────────────────── */}
        <div className="p-5 flex flex-col flex-1" dir="rtl">
          <h3 className="text-base font-extrabold mb-2 leading-snug" style={{ color: "#0f172a" }}>
            {project.title}
          </h3>

          <p
            className="text-sm leading-relaxed mb-4"
            style={{
              color: "#64748b",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>

          {/* شريط التقدم */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold" style={{ color: "#1856FF" }}>نسبة الإنجاز</span>
              <span className="text-xs font-extrabold" style={{ color: "#1856FF" }}>{progress}%</span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: "8px", background: "#e2e8f0" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, delay: index * 0.07 + 0.2, ease: "easeOut" }}
                style={{ height: "100%", background: gradient, borderRadius: "9999px" }}
              />
            </div>
          </div>

          {/* التفاصيل المختصرة */}
          <div className="flex flex-col gap-2 mb-5 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
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

          {/* زر عرض التفاصيل */}
          <button
            onClick={toggleExpand}
            className="mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #1856FF, #07CA6B)",
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(24,86,255,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ChevronDown size={15} />
            عرض التفاصيل
          </button>
        </div>
      </motion.div>

      {/* Modal يظهر في منتصف الشاشة */}
      {isExpanded && (
        <ProjectModal
          project={project}
          gradient={gradient}
          progress={progress}
          onClose={() => setExpandedId(null)}
          onDonate={handleDonate}
        />
      )}
    </>
  );
}