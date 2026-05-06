import { motion } from "framer-motion";

export default function ProjectStats({ stats }) {
  const items = [
    { value: stats?.total        ?? "—", label: "إجمالي المشاريع"  },
    { value: stats?.active       ?? "—", label: "مشاريع نشطة"      },
    { value: stats?.done         ?? "—", label: "مشاريع مكتملة"    },
    {
      value: stats?.beneficiaries
        ? Number(stats.beneficiaries).toLocaleString("ar-EG")
        : "—",
      label: "مستفيد",
    },
  ];

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
      {items.map((s, i) => (
        <div
          key={i}
          className="px-10 py-5 text-center"
          style={{
            borderRight: i < items.length - 1 ? "1px solid rgba(24,86,255,0.1)" : "none",
          }}
        >
          <motion.div
            key={s.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="text-3xl font-extrabold"
            style={{ color: "#1856FF" }}
          >
            {s.value}
          </motion.div>
          <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#64748b" }}>
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}