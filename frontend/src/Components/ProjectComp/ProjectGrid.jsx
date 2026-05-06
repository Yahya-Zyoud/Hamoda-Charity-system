import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ projects }) {
  // مشروع واحد مفتوح في نفس الوقت
  const [expandedId, setExpandedId] = useState(null);

  if (!projects || projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 text-sm"
        style={{ color: "#94a3b8" }}
        dir="rtl"
      >
        لا توجد مشاريع مطابقة للبحث
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 pb-16" dir="rtl">
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project._id || idx}
              project={project}
              index={idx}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}