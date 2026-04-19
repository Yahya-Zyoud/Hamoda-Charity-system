import { useEffect, useRef, useState } from "react";
import { getPartners } from "../../services/api";
import { Handshake, Star, Briefcase, Landmark, Heart, Building2, Building, Crown, AlertTriangle, Hospital, HeartPulse } from "lucide-react";

function PartnerCard({ partner, index }) {

  const themeMap = {
    "🏛️": { icon: Landmark, color: "from-blue-500 to-indigo-600" },
    "👑": { icon: Crown, color: "from-amber-500 to-orange-500" },
    "🏥": { icon: Hospital, color: "from-red-500 to-rose-600" },
    "💼": { icon: Briefcase, color: "from-green-500 to-emerald-600" },
    "🌟": { icon: Star, color: "from-violet-500 to-purple-600" },
    "🤝": { icon: Handshake, color: "from-teal-500 to-cyan-600" },
    "🏦": { icon: Building, color: "from-sky-500 to-blue-600" },
    "❤️": { icon: HeartPulse, color: "from-rose-500 to-pink-600" }
  };

  const defaultTheme = { icon: Building2, color: "from-gray-500 to-slate-600" };
  const theme = partner.emoji ? themeMap[partner.emoji] || defaultTheme : defaultTheme;
  const color = theme.color;
  const Icon = theme.icon;

  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform overflow-hidden`}
      >
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <Icon className="w-6 h-6 text-white" />
        )}
      </div>

      <p className="text-blue-950 font-bold text-sm leading-tight text-center">
        {partner.name}
      </p>

      <div
        className={`mt-2 h-1 w-8 rounded-full bg-gradient-to-r ${color} group-hover:w-full transition-all duration-500`}
      />
    </div>
  );
}


function PartnerSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-200 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-1 w-8 rounded-full bg-gray-200" />
    </div>
  );
}


export default function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const posRef    = useRef(0);
  const animRef   = useRef(null);

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

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || loading || partners.length === 0) return;

    const step = () => {
      if (!isPaused) {
        posRef.current -= 0.5;
        const halfWidth = container.scrollWidth / 2;
        if (Math.abs(posRef.current) >= halfWidth) {
          posRef.current = 0;
        }
        container.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused, loading, partners]);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 rounded-full mb-4">
          <Handshake className="text-blue-600 w-5 h-5" />

          <span className="text-blue-700 font-bold text-sm">شركاؤنا ومانحونا</span>
        </div>

        <h2 className="text-4xl font-black text-blue-900 mb-3">
          نعمل مع أفضل <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">الشركاء</span>
        </h2>

        <p className="text-gray-500 text-xl max-w-xl mx-auto">
          شركاء موثوقون يدعمون مسيرتنا لخدمة المجتمع
        </p>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
         
          <div className="text-red-500 bg-red-100 p-3 rounded-full mb-2"><AlertTriangle className="w-10 h-10" /></div>
          <p className="text-red-600 font-semibold text-lg">
            حدث خطأ أثناء تحميل البيانات
          </p>
        
          <button
            onClick={fetchPartners}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-base font-semibold shadow-md transition duration-200 hover:bg-blue-700 hover:scale-[1.02]"
          >
            إعادة المحاولة
          </button>
        </div>
      )}


      {loading && !error && (
        <div className="flex gap-6 px-6 overflow-hidden">
          {[1, 2, 3, 4, 5].map((n) => (
            <PartnerSkeleton key={n} />
          ))}
        </div>
      )}


      {!loading && !error && partners.length > 0 && (

        <div
          className="overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-6 w-max"
            style={{ willChange: "transform" }}
          >

            {[...partners, ...partners].map((partner, i) => (
              <PartnerCard key={`${partner.id}-${i}`} partner={partner} index={i} />
            ))}
          </div>
        </div>
      )}


      {!loading && !error && partners.length === 0 && (

        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
          <Handshake className="w-12 h-12 mb-2" />
          <p className="text-gray-500 font-semibold">
            لا يوجد شركاء مضافون حالياً
          </p>

        </div>
      )}
    </section>
  );
}