import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative z-10 py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 30%, #6ee7b7 60%, #34d399 100%)" }}
      >
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #bbf7d0 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6ee7b7 0%, transparent 40%)" }} />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 flex justify-center mb-6">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-green-200 shadow-sm">
            <Heart className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="text-green-700 font-semibold text-sm tracking-wide uppercase">Hamoda Charity Organization</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="relative z-10 text-5xl md:text-6xl font-bold text-green-900 mb-6 leading-tight">
          Meet Our Team
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="relative z-10 text-xl text-green-800/80 max-w-2xl mx-auto leading-relaxed mb-10">
          United by compassion, driven by purpose. Together we build a world where every person has the support they deserve.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="relative z-10 flex justify-center gap-8">
          {[{ value: "16+", label: "Team Members" }, { value: "5", label: "Departments" }, { value: "1000+", label: "Lives Impacted" }].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-green-800">{stat.value}</div>
              <div className="text-sm text-green-700/80 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="absolute bottom-0 left-0 right-0 h-16 z-10" style={{ background: "linear-gradient(to bottom, transparent, hsl(210 40% 98%))" }} />
      </div>
    </section>
  );
}