import {
  Landmark,
  Crown,
  Hospital,
  Briefcase,
  Star,
  Handshake,
  Building,
  HeartPulse,
  Building2,
} from "lucide-react";

export const partnerThemeMap = {
  "🏛️": { icon: Landmark, color: "from-blue-500 to-indigo-600" },
  "👑": { icon: Crown, color: "from-amber-500 to-orange-500" },
  "🏥": { icon: Hospital, color: "from-red-500 to-rose-600" },
  "💼": { icon: Briefcase, color: "from-green-500 to-emerald-600" },
  "🌟": { icon: Star, color: "from-violet-500 to-purple-600" },
  "🤝": { icon: Handshake, color: "from-teal-500 to-cyan-600" },
  "🏦": { icon: Building, color: "from-sky-500 to-blue-600" },
  "❤️": { icon: HeartPulse, color: "from-rose-500 to-pink-600" },
};

export const defaultPartnerTheme = {
  icon: Building2,
  color: "from-gray-500 to-slate-600",
};

export const getPartnerTheme = (emoji) => {
  return partnerThemeMap[emoji] || defaultPartnerTheme;
};
