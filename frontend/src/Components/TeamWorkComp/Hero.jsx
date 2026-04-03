// components/Hero.jsx
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-700 py-20">
      {/* Background blurred circles - بألوان خضراء أعمق */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-green-700 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-24 w-[700px] h-[700px] bg-green-600/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white text-sm font-medium tracking-wide mb-6"
        >
          💚 THE PEOPLE BEHIND THE MISSION
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
        >
          Meet Our Team
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow"
        >
          Doctors, volunteers, and administrators united by a single purpose — 
          bringing hope and care to communities that need it most. Every face 
          here represents a story of compassion.
        </motion.p>
      </div>
    </section>
  );
}