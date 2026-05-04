import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ServiceCard } from "../../../components/cards";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getServices();

        const withIcons = data.map((s) => ({
          ...s,
          icon: iconsMap[s.icon],
        }));

        setServices(withIcons);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
        setError("تعذر تحميل الخدمات حالياً. حاول مرة أخرى بعد قليل.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      id="services"
      dir="rtl"
      className="relative py-20 xl:py-24 bg-[#f0f4f8] overflow-hidden font-[Cairo,sans-serif]"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-blue-100/20 via-emerald-100/15 to-teal-50/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="page-shell px-4 md:px-6 xl:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-14 xl:mb-16">

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
            className="text-4xl md:text-5xl font-bold font-tajawal text-slate-900 mb-5 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent"
          >
            تمكين إنساني عبر حلول مستدامة
          </motion.h2>

          <motion.p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            نعمل كحلقة وصل موثوقة بين المتبرع والمستفيد من خلال منظومة تقنية
            متقدمة تضمن الجودة، الأمان، والشفافية.

          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7"
        >
          {loading && (
            <div className="col-span-full text-center text-slate-500 font-semibold">
              جاري تحميل الخدمات...
            </div>
          )}
          {!loading && error && (
            <div className="col-span-full rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-700 font-semibold">
              {error}
            </div>
          )}
          {!loading && !error && services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '#about'}
            className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white shadow-[0_10px_20px_rgb(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_15px_30px_rgb(16,185,129,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="relative z-10 flex items-center gap-3">
              من نحن
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
