import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function ProjectCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-5 mb-12 rounded-3xl overflow-hidden text-center py-16 px-6"
      style={{
        background: "linear-gradient(135deg, #1856FF 0%, #0ea5e9 50%, #07CA6B 100%)",
      }}
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" dir="rtl">
        ساهم في دعم مشاريعنا
      </h2>
      <p
        className="text-base md:text-lg mb-8 max-w-xl mx-auto"
        style={{ color: "rgba(255,255,255,0.85)" }}
        dir="rtl"
      >
        تبرعك يساعدنا في الاستمرار في تقديم خدماتنا وتوسيع نطاق مشاريعنا الإنسانية
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 px-10 py-3.5 rounded-2xl font-extrabold text-base transition-all"
        style={{
          background: "white",
          color: "#1856FF",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <Heart size={18} className="fill-current" />
        تبرع الآن
      </motion.button>
    </motion.section>
  );
}