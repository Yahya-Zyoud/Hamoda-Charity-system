// components/TeamCard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamCard({ member }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <motion.div
      layout
      onClick={toggleExpand}
      className={`bg-white rounded-xl p-5 shadow-md transition-all duration-300 cursor-pointer
        ${expanded ? "ring-2 ring-emerald-400 shadow-xl" : "hover:shadow-xl hover:scale-[1.02]"}
      `}
      whileHover={{ scale: expanded ? 1 : 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* رأس البطاقة - الصورة والحروف الأولى والاسم والمنصب */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
          {member.initials}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{member.name}</h3>
          <p className="text-xs text-emerald-600 font-medium">{member.role}</p>
        </div>
      </div>

      {/* النص المختصر - يظهر دائماً */}
      <p className="text-sm text-slate-600 mb-2 leading-relaxed">
        {member.details}
      </p>

      {/* زر "Read More" - يظهر فقط عند عدم التوسع */}
      {!expanded && (
        <button className="text-emerald-600 text-sm font-medium hover:text-emerald-800 transition">
          Read More →
        </button>
      )}

      {/* المحتوى الموسع - يظهر عند النقر */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-100 space-y-2"
          >
            <p className="text-sm text-slate-700">
              <span className="font-semibold">📧 Email:</span> {member.email}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">⭐ Experience:</span> {member.experience}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">📍 Location:</span> {member.location}
            </p>
            <p className="text-sm text-slate-600 italic">
              "{member.fullBio}"
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // منع إغلاق البطاقة عند الضغط على الزر
                setExpanded(false);
              }}
              className="mt-2 text-xs text-emerald-500 hover:text-emerald-700"
            >
              Show less ↑
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}