import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Briefcase, Activity } from "lucide-react";

const useCounting = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);

      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(end * ease));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const stats = [
  { id: 1, name: "إجمالي المستفيدين", value: 50430, suffix: "+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 2, name: "مشروع منجز", value: 1250, suffix: "+", icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: 3, name: "متبرع كريم", value: 8300, suffix: "+", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
  { id: 4, name: "متطوع نشط", value: 340, suffix: "+", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
];

export default function StatsSection() {
  return (
    <section dir="rtl" className="relative z-40 -mt-12 sm:-mt-16 md:-mt-24 w-full px-4 mb-16 font-[Cairo,sans-serif]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-white/60 p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4 relative overflow-hidden group"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-500/5 via-emerald-500/5 to-rose-500/5 blur-3xl pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

          {stats.map((stat, index) => {
            const count = useCounting(stat.value, 2500 + (index * 400));
            const Icon = stat.icon;

            return (
              <div key={stat.id} className="flex flex-col items-center justify-center text-center relative z-10 hover:-translate-y-2 transition-transform duration-300 cursor-default">

                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner border border-white/50`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>

                <div className="text-4xl md:text-5xl font-black text-slate-800 mb-3 flex items-baseline tracking-tight">
                  <span dir="ltr">{count.toLocaleString('en-US')}</span>
                  <span className={`${stat.color} ml-1 transform block`}>{stat.suffix}</span>
                </div>

                <div className="text-base md:text-lg font-bold text-slate-500">
                  {stat.name}
                </div>

                {index !== stats.length - 1 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
