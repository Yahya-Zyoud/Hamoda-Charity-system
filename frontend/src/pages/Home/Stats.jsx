import { useEffect, useRef, useState } from "react";
import { Users, FolderOpen, Heart, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "مستفيد",
    sublabel: "من مختلف المناطق",
    color: "from-green-500 to-emerald-400",
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: FolderOpen,
    value: 120,
    suffix: "+",
    label: "مشروع منجز",
    sublabel: "في التعليم والصحة والبنية",
    color: "from-teal-500 to-cyan-400",
    bg: "bg-teal-50",
    border: "border-teal-200",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    icon: Heart,
    value: 850,
    suffix: "K",
    label: "ريال تبرعات",
    sublabel: "وصلت للمحتاجين مباشرة",
    color: "from-rose-500 to-pink-400",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Globe,
    value: 8,
    suffix: "",
    label: "سنوات خبرة",
    sublabel: "في العمل الخيري والإنساني",
    color: "from-blue-500 to-indigo-400",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

function useCountUp(target, duration, active) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

function StatCard({ stat, index, active }) {
  const count = useCountUp(stat.value, 2000 + index * 200, active);
  const Icon = stat.icon;

  return (
    <div
      className={`relative ${stat.bg} rounded-3xl p-6 border-2 ${stat.border} card-hover group overflow-hidden`}
    >
      <div
        className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start gap-4">
        <div
          className={`${stat.iconBg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-7 h-7 ${stat.iconColor}`} />
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {count.toLocaleString("ar-SA")}
            </span>

            <span
              className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.suffix}
            </span>
          </div>

          <p className="text-gray-800 font-bold text-lg mt-1">
            {stat.label}
          </p>

          <p className="text-gray-500 text-sm mt-0.5">
            {stat.sublabel}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-30`}
      />
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-10 bg-white relative overflow-hidden -mt-24"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 font-bold text-sm">
              إنجازاتنا بالأرقام
            </span>
          </div>

          <h2 className="text-4xl font-black text-gray-900 mb-3">
            أثرنا الحقيقي في الأرقام
          </h2>

          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            كل رقم يمثل قصة نجاح حقيقية وحياة تغيرت للأفضل
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              active={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}