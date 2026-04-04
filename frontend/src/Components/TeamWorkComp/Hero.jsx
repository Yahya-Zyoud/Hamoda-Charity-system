import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 py-20">
      
      {/* Background blurred circles - ألوان فاتحة */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-24 w-[700px] h-[700px] bg-green-200/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 text-emerald-700 text-sm font-medium tracking-wide mb-6"
        >
          💚 THE PEOPLE BEHIND THE MISSION
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-emerald-800 drop-shadow"
        >
          Meet Our Team
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg md:text-xl text-emerald-700 max-w-3xl mx-auto leading-relaxed"
        >
          Doctors, volunteers, and administrators united by a single purpose — 
          bringing hope and care to communities that need it most. Every face 
          here represents a story of compassion.
        </motion.p>
      </div>
    </section>
  );
}