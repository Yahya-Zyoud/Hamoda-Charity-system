// Animated gradient hero banner shown at the top of the public team page.
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 text-center"
      style={{ background: "linear-gradient(135deg, #1856FF 0%, #0ea5e9 40%, #07CA6B 100%)" }}
    >
      {/* Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(7,202,107,0.15)" }} />
      <div className="absolute top-8 right-32 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.06)" }} />

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
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          الأشخاص خلف المهمة
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight"
        >
          تعرّف على فريقنا
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          أطباء ومتطوعون وإداريون متحدون بهدف واحد —
          نقل الأمل والرعاية إلى المجتمعات التي في أمس الحاجة إليها.
        </motion.p>
      </div>
    </section>
  );
}