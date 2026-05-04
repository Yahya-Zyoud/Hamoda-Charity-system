import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowDown, Compass } from "lucide-react";
import { circleIconsData } from "../../../constants/heroSection";
import { useAppAuth } from "../../../contexts/AppAuthContext";
import { isClerkConfigured } from "../../../lib/clerkConfig";
import { useClerkSignInButton } from "../../../hooks/useClerkSignInButton";
import { openDonationInquiry } from "../../../lib/contactLinks";

export default function HeroSection() {
  const { user } = useAppAuth();
  const SignInBtn = useClerkSignInButton(!user);

  return (
    <section
      id="home"
      className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden bg-white"
      dir="rtl"
    >
      <motion.img
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src="/images/background.webp"
        alt="hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-white/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70" />

      {circleIconsData.map((circle, i) => {
        const Icon = circle.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.3 + i * 0.15,
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            className={`absolute ${circle.x} ${circle.y} ${circle.size} rounded-full bg-gradient-to-br ${circle.bg} shadow-2xl border-[3px] border-white flex flex-col items-center justify-center cursor-pointer z-20`}
            style={{ animation: `float 6s ease-in-out infinite alternate ${circle.delay}` }}
          >
            <Icon className={`w-9 h-9 mb-1 ${circle.color}`} strokeWidth={1.5} />
            <span className="text-[11px] font-black text-slate-700 text-center px-1 tracking-tight">
              {circle.label}
            </span>
          </motion.div>
        );
      })}

      <div className="relative z-30 text-center max-w-4xl px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="heading-xl font-tajawal text-slate-900 mb-6 drop-shadow-sm leading-tight">
            معاً..
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-emerald-500">
              نبني مستقبلاً أفضل
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-slate-700 mb-4 max-w-2xl mx-auto">
            انضم إلينا لصنع الفرق الحقيقي في حياة المحتاجين والمستضعفين
          </p>

          <p className="text-slate-500 text-base md:text-lg font-medium mb-10 leading-relaxed max-w-2xl mx-auto">
            كل تبرع يحدث فارقاً حقيقياً. كل مشروع يغير حياة. كن جزءاً من هذه الرحلة النبيلة.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          {user || !isClerkConfigured ? (
            <button
              type="button"
              onClick={() => openDonationInquiry()}
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-tajawal font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              تبرع الآن
            </button>
          ) : SignInBtn ? (
            <SignInBtn mode="modal">
              <button className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-tajawal font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer">
                <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                تبرع الآن
              </button>
            </SignInBtn>
          ) : (
            <button
              type="button"
              disabled
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-tajawal font-bold text-lg shadow-lg opacity-70 cursor-not-allowed"
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
            className="group flex items-center gap-3 bg-white text-slate-800 px-8 py-4 rounded-2xl font-tajawal font-bold text-lg shadow-md border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Compass className="w-5 h-5 text-blue-600 group-hover:animate-spin-slow" />
            </div>
            اكتشف مشاريعنا
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">اكتشف المزيد</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-emerald-500" />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
      `}</style>
    </section>
  );
}
