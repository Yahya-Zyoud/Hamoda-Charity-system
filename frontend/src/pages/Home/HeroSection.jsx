import { useState, useEffect } from "react";
import { Heart, ArrowLeft, PlayCircle, ArrowDown } from "lucide-react";

const circleImages = [
  { bg: "from-green-200 via-green-100 to-teal-100", emoji: "🌱", label: "نمو مستدام", x: "left-[3%]", y: "top-[6%]", size: "w-44 h-44", delay: "0s" },
  { bg: "from-teal-200 via-blue-100 to-cyan-100", emoji: "👴👵", label: "رعاية المسنين", x: "right-[2%]", y: "top-[8%]", size: "w-52 h-52", delay: "0.5s" },
  { bg: "from-emerald-200 via-green-100 to-lime-100", emoji: "🌍", label: "مجتمع أفضل", x: "left-[8%]", y: "bottom-[15%]", size: "w-36 h-36", delay: "1s" },

  { 
    bg: "from-blue-200 via-indigo-100 to-sky-100",
    emoji: "🤝",
    label: "دعم مستمر",
    x: "right-[6%]",
    y: "bottom-[6%]",
    size: "w-40 h-40",
    delay: "1.3s"
  },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden" dir="rtl">
      
      <img
        src="/images/background.webp"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />

      {
      circleImages.map((circle, i) => (

        <div
          key={i}
          className={`absolute ${circle.x} ${circle.y} ${circle.size} rounded-full bg-gradient-to-br ${circle.bg} shadow-2xl border-4 border-white/60 flex flex-col items-center justify-center animate-float cursor-pointer hover:scale-110 transition-transform duration-500 z-20`}
          style={{ animationDelay: circle.delay }}
        >
          <span className="text-4xl mb-1">{circle.emoji}</span>
          <span className="text-xs font-bold text-green-800 text-center px-2">
            {circle.label}
          </span>

        </div>
      ))}

      <div
        className={`relative z-30 text-center max-w-3xl px-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-[-20px]" : "opacity-0 translate-y-8"
        }`
      }
      >
        <h1 className="text-5xl md:text-7xl font-black text-blue-900 leading-tight mb-6">
          معًا..<br />
          <span className="text-blue-800">نبني مستقبلًا أفضل</span>
        </h1>

        <p className="text-gray-700 text-xl md:text-2xl font-semibold mb-8 leading-relaxed">
          انضم إلينا لصنع الفرق في حياة المحتاجين<br />

          <span className="text-gray-600 text-lg">
            كل تبرع يُحدث فارقًا حقيقيًا في حياة إنسان
          </span>

        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">

          <button className="group flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-base shadow-md transition duration-200 hover:bg-blue-700 hover:scale-[1.02] cursor-pointer">

            <Heart className="w-5 h-5 fill-white" />
            تبرع الآن
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            
          </button>

          <button className="flex items-center gap-3 bg-white/85 hover:bg-green-50 text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg
           shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer">

            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <PlayCircle className="w-4 h-4 text-green-800" />
            </div>
            تعرف على مشاريعنا
          </button>

        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-600">اكتشف المزيد</span>
          <ArrowDown className="w-6 h-6 text-green-600 animate-bounce" />
        </div>
      </div>

    </section>
  );
}