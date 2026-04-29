import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ServiceCard } from "../../../Components/Cards";
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
      className="relative py-20 xl:py-24 bg-slate-50 overflow-hidden font-[Cairo,sans-serif]"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-blue-100/40 via-emerald-100/30 to-teal-50/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
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
      </div>
    </section>
  );
}
