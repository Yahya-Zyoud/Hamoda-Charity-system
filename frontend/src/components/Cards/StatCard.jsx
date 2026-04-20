import { useCountUp } from "../../hooks/useCountUp";

export const StatCard = ({ stat, index }) => {
  const count = useCountUp(stat.value, 2500 + index * 400);
  const Icon = stat.icon;

  return (
    <div className="flex flex-col items-center justify-center text-center relative z-10 hover:-translate-y-2 transition-transform duration-300 cursor-default">
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner border border-white/50`}
      >
        <Icon className="w-8 h-8 md:w-10 md:h-10" />
      </div>

      <div className="text-4xl md:text-5xl font-black text-slate-800 mb-3 flex items-baseline tracking-tight">
        <span dir="ltr">{count.toLocaleString("en-US")}</span>
        <span className={`${stat.color} ml-1 transform block`}>{stat.suffix}</span>
      </div>

      <div className="text-base md:text-lg font-bold text-slate-500">
        {stat.name}
      </div>

      {index !== 3 && (
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      )}
    </div>
  );
};

export default StatCard;
