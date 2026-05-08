/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import { Heart, ArrowDown, Compass } from "lucide-react";
import { circleIconsData } from "../../../constants/heroSection";
import { useAppAuth } from "../../../contexts/AppAuthContext";
import { isClerkConfigured } from "../../../lib/clerkConfig";
import { useClerkSignInButton } from "../../../hooks/useClerkSignInButton";
import { openDonationInquiry } from "../../../lib/contactLinks";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAppAuth();
  const SignInBtn = useClerkSignInButton(!user);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden"
      dir="rtl"
    >
      <img
        src="/images/background.webp"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />

      {circleIconsData.map((circle, i) => {
        const Icon = circle.icon;
        return (
          <div
            key={i}
            className={`absolute ${circle.x} ${circle.y} ${circle.size} rounded-full bg-gradient-to-br ${circle.bg} shadow-2xl border-4 border-white/60 flex flex-col items-center justify-center animate-float cursor-pointer hover:scale-110 transition-transform duration-500 z-20`}
            style={{ animationDelay: circle.delay }}
          >
            <Icon className={`w-10 h-10 mb-2 ${circle.color}`} strokeWidth={1.5} />
            <span className="text-xs font-bold text-green-800 text-center px-2">
              {circle.label}
            </span>
          </div>
        );
      })}

      <div
        className={`relative z-30 text-center max-w-4xl px-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1 className="heading-xl font-tajawal text-blue-950 mb-6 drop-shadow-lg">
          معاً..
          <br />
          <span className="text-blue-700">نبني مستقبلاً أفضل</span>
        </h1>

        <p className="text-subtitle text-gray-800 mb-4 drop-shadow-md max-w-2xl mx-auto">
          انضم إلينا لصنع الفرق الحقيقي في حياة المحتاجين والمستضعفين
        </p>

        <p className="text-gray-600 text-base md:text-lg font-medium mb-10 leading-relaxed drop-shadow-sm max-w-2xl mx-auto">
          كل تبرع يحدث فارقاً حقيقياً. كل مشروع يغير حياة. كن جزءاً من هذه الرحلة النبيلة.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {user || !isClerkConfigured ? (
            <button
              type="button"
              onClick={() => openDonationInquiry()}
              className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-tajawal font-bold text-lg shadow-lg transition duration-200 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.03] cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white" />
              تبرع الآن
            </button>
          ) : SignInBtn ? (
            <SignInBtn mode="modal">
              <button className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-tajawal font-bold text-lg shadow-lg transition duration-200 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.03] cursor-pointer">
                <Heart className="w-5 h-5 fill-white" />
                تبرع الآن
              </button>
            </SignInBtn>
          ) : (
            <button
              type="button"
              disabled
              className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-tajawal font-bold text-lg shadow-lg opacity-70 cursor-not-allowed"
            >
              <Heart className="w-5 h-5 fill-white" />
              تبرع الآن
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-tajawal font-bold text-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.03] cursor-pointer border border-gray-200"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Compass className="w-5 h-5 text-blue-600" />
            </div>
            اكتشف مشاريعنا
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
