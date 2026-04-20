import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ServiceCard } from "../../../components/Cards";
import { getServices } from "../../../services/api";
import {
  ShieldCheck,
  Search,
  FileText,
  Users,
  Clock,
  Heart,
} from "lucide-react";

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

export default function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServices();

        const withIcons = data.map((s) => ({
          ...s,
          icon: iconsMap[s.icon],
        }));

        setServices(withIcons);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      dir="rtl"
      className="relative py-32 bg-slate-50 overflow-hidden font-[Cairo,sans-serif]"
    >
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
            className="heading-lg font-tajawal text-slate-900 mb-6 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent"
          >
            تمكين إنساني عبر حلول مستدامة
          </motion.h2>

          <motion.p className="text-body-lg text-gray-700 max-w-3xl mx-auto">
            نعمل كحلقة وصل موثوقة بين المتبرع والمستفيد من خلال منظومة تقنية
            متقدمة تضمن الجودة، الأمان، والشفافية.
         
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
    </section>
  );
}
