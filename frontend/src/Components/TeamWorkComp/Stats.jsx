import { motion } from "framer-motion";

const STATS = [
  { value: "48",   label: "Team Members"   },
  { value: "12+",  label: "Specializations" },
  { value: "50K+", label: "Lives Impacted"  },
];

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="flex flex-wrap justify-center"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(24,86,255,0.12)",
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={i}
          className="px-10 py-5 text-center"
          style={{
            borderRight: i < STATS.length - 1 ? "1px solid rgba(24,86,255,0.1)" : "none",
          }}
        >
          <div className="text-3xl font-extrabold" style={{ color: "#1856FF" }}>
            {s.value}
          </div>
          <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#64748b" }}>
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}