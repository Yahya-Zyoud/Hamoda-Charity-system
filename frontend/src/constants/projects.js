import {
  Droplets,
  HeartHandshake,
  Target,
  Leaf,
  ShieldCheck,
  Activity,
} from "lucide-react";

export const projectDesignMap = [
  { icon: Droplets, color: "from-blue-400 to-indigo-600", shadow: "shadow-blue-200" },
  { icon: HeartHandshake, color: "from-rose-400 to-red-600", shadow: "shadow-rose-200" },
  { icon: Target, color: "from-amber-400 to-orange-600", shadow: "shadow-amber-200" },
  { icon: Leaf, color: "from-emerald-400 to-teal-600", shadow: "shadow-emerald-200" },
  { icon: ShieldCheck, color: "from-purple-400 to-fuchsia-600", shadow: "shadow-purple-200" },
  { icon: Activity, color: "from-cyan-400 to-blue-600", shadow: "shadow-cyan-200" },
];

export const getProjectDesign = (id) => {
  return projectDesignMap[id % projectDesignMap.length];
};
