import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getPartners } from "../../../services/api";
import { PartnerCard } from "../../../components/cards";
import { Handshake, AlertTriangle } from "lucide-react";

function PartnerSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl p-6 border border-gray-100 animate-pulse shadow-sm">
      <div className="w-16 h-16 rounded-xl bg-gray-200 mb-4" />
      <div className="h-5 bg-gray-200 rounded w-4/5 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-3/5" />
    </div>
  );
}

export default function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const isPausedRef = useRef(false);
  const posRef = useRef(0);
  const animRef = useRef(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartners();
      setPartners(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track || loading || partners.length === 0) return;

    posRef.current = 0;

    const step = () => {
      if (!isPausedRef.current) {
        posRef.current -= 0.6;
        const half = track.scrollWidth / 2;
        if (Math.abs(posRef.current) >= half) posRef.current = 0;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [loading, partners]);

  return (
    <section id="partners" dir="rtl" className="relative pt-16 pb-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

      <div className="page-shell relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 xl:mb-12"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-100 mb-6">
            <Handshake className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">شركاؤنا الموثوقون</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: '"Tajawal", sans-serif' }}>
            نعمل مع أفضل الشركاء
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            شراكات استراتيجية قوية تدعم رسالتنا الإنسانية وتساهم في تحقيق أهدافنا الخيرية
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold text-lg">حدث خطأ أثناء تحميل الشركاء</p>
            <button onClick={fetchPartners} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              إعادة المحاولة
            </button>
          </motion.div>
        )}

        {loading && !error && (
          <div className="flex gap-6 px-6 overflow-hidden">
            {[1, 2, 3, 4].map((n) => <PartnerSkeleton key={n} />)}
          </div>
        )}

        {!loading && !error && partners.length > 0 && (

          <div
            dir="ltr"
            className="relative"
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { isPausedRef.current = false; }}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                ref={scrollRef}
                className="flex gap-6 w-max"
                style={{ willChange: "transform" }}
              >
                {[...partners, ...partners].map((partner, i) => (
                  <div key={`${partner.id}-${i}`} className="flex-shrink-0 w-72">
                    <PartnerCard partner={partner} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && partners.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">لا توجد شركاء متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
}
