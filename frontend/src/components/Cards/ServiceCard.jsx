import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const ServiceCard = ({ service, index }) => {
  const Icon = service.icon || ShieldCheck;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
      className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_5px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 p-8 flex flex-col h-full cursor-pointer"
    >
      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />

      <div className="absolute top-8 left-8 text-5xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors duration-500 pointer-events-none select-none">
        {service.num}
      </div>

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center mb-8 border border-emerald-100 group-hover:from-blue-600 group-hover:to-emerald-500 group-hover:border-emerald-500 transition-all duration-500">
          <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110" />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4 transition-all duration-300
          group-hover:text-transparent group-hover:bg-gradient-to-r
          group-hover:from-blue-600 group-hover:to-emerald-500 group-hover:bg-clip-text">
          {service.name}
        </h3>

        <div className="w-8 h-1 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full mb-4 group-hover:w-16 group-hover:from-blue-500 group-hover:to-emerald-500 transition-all duration-500" />

        <p className="text-slate-500 leading-relaxed font-medium">
          {service.desc}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <button className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-emerald-600 transition-colors duration-300">
          اقرأ المزيد
          <ArrowLeft className="w-4 h-4 rtl:-scale-x-100 transform group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
