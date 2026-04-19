import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  FileText,
  Users,
  Clock,
  Heart,
  ArrowLeft,
  Sparkles
} from "lucide-react";

import { getServices } from "../../services/api"

const iconsMap = {
  ShieldCheck,
  Search,
  FileText,
  Users,
  Clock,
  Heart,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

function ServiceCard({ service, index }) {
  const Icon = service.icon || ShieldCheck;

  return (
    <motion.div
      variants={itemVariants}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
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
}

export default function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServices();

        const withIcons = data.map(s => ({
          ...s,
          icon: iconsMap[s.icon]
        }));

        setServices(withIcons);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <section dir="rtl" className="relative py-32 bg-slate-50 overflow-hidden font-[Cairo,sans-serif]">

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -right-[20%] w-[1200px] h-[1200px] bg-gradient-to-br from-blue-100/40 via-emerald-100/30 to-teal-50/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-20">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-sm mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            أهدافنا وخدماتنا الأساسية
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight"
          >
            تمكين إنساني عبر{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent relative">
              حلول مستدامة
            </span>
          </motion.h2>

          <motion.p className="text-slate-500 text-lg leading-relaxed font-medium">
            نعمل كحلقة وصل موثوقة بين المتبرع والمستفيد من خلال منظومة تقنية متقدمة تضمن الجودة، الأمان، والشفافية.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shine {
          100% { left: 125%; }
        }
        .animate-shine {
          animation: shine 1.2s cubic-bezier(0.8, 0, 0.2, 1);
        }
      `}} />
    </section>
  );
}