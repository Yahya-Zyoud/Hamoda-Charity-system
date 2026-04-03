// components/Stats.jsx
import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { value: "9", label: "TRUE EXPERIENCE" },
    { value: "12+", label: "COUNTER-APPROVAL" },
    { value: "50K+", label: "1,000+ DOCUMENTS" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="flex flex-wrap justify-center items-center gap-12 md:gap-20 py-8 bg-white shadow-sm"
    >
      {stats.map((s, idx) => (
        <div key={idx} className="text-center">
          <div className="text-5xl md:text-6xl font-bold text-emerald-700">{s.value}</div>
          <div className="text-sm text-slate-500 tracking-wide mt-2 uppercase">{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
}