import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["الكل", "صحة", "تعليم", "إغاثة", "بنية تحتية", "دعم نفسي", "تدريب", "رعاية", "إسكان", "أخرى"];
const STATUSES   = ["الكل", "نشط", "مكتمل", "قيد التخطيط"];

export default function ProjectFilters({ search, setSearch, category, setCategory, status, setStatus, total, filtered }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-5 mt-8 mb-2" dir="rtl">
      {/* شريط البحث */}
      <div className="flex gap-3 items-center mb-4">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(24,86,255,0.2)",
            boxShadow: "0 2px 12px rgba(24,86,255,0.06)",
          }}
        >
          <Search size={16} color="#1856FF" className="shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن مشروع بالاسم أو الوصف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#1e293b", fontFamily: "inherit" }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} color="#94a3b8" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
          style={{
            background: showFilters ? "#1856FF" : "rgba(255,255,255,0.85)",
            color: showFilters ? "white" : "#1856FF",
            border: "1px solid rgba(24,86,255,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <SlidersHorizontal size={15} />
          تصفية
        </button>
      </div>

      {/* الفلاتر */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div
              className="p-5 rounded-2xl flex flex-wrap gap-6"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(24,86,255,0.12)",
                boxShadow: "0 2px 16px rgba(24,86,255,0.06)",
              }}
            >
              {/* التصنيف */}
              <div>
                <p className="text-xs font-bold mb-2.5" style={{ color: "#475569" }}>التصنيف</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                      style={{
                        background: category === c ? "#1856FF" : "rgba(24,86,255,0.08)",
                        color: category === c ? "white" : "#1856FF",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* الحالة */}
              <div>
                <p className="text-xs font-bold mb-2.5" style={{ color: "#475569" }}>الحالة</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                      style={{
                        background: status === s ? "#07CA6B" : "rgba(7,202,107,0.08)",
                        color: status === s ? "white" : "#07CA6B",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs mb-5" style={{ color: "#94a3b8" }}>
        عرض <span style={{ color: "#1856FF", fontWeight: 700 }}>{filtered}</span> من {total} مشروع
      </p>
    </div>
  );
}