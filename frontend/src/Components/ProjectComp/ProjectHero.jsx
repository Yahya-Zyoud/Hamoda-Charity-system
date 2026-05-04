import { motion } from "framer-motion";

export default function ProjectHero() {
  return (
    <section
      className="relative overflow-hidden py-20 text-center"
      style={{
        background: "linear-gradient(135deg, #1856FF 0%, #0ea5e9 45%, #07CA6B 100%)",
      }}
    >
      {/* خلفية دوائر */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="absolute -bottom-28 -right-20 w-[28rem] h-[28rem] rounded-full pointer-events-none"
        style={{ background: "rgba(7,202,107,0.13)" }} />
      <div className="absolute top-10 right-36 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.05)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-white text-xs font-semibold tracking-widest"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          OUR IMPACT ON THE GROUND
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight"
        >
          مشاريعنا
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          من الصحة إلى التعليم، نعمل على مشاريع تنموية تُغيّر حياة المحتاجين
          في فلسطين يومًا بعد يوم.
        </motion.p>
      </div>
    </section>
  );
}