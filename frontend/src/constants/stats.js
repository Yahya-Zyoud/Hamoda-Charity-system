import { Users, Briefcase, Heart, Activity } from "lucide-react";

export const statsData = [
  {
    id: 1,
    name: "إجمالي المستفيدين",
    value: 50430,
    suffix: "+",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    name: "مشروع منجز",
    value: 1250,
    suffix: "+",
    icon: Briefcase,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 3,
    name: "متبرع كريم",
    value: 8300,
    suffix: "+",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    id: 4,
    name: "متطوع نشط",
    value: 340,
    suffix: "+",
    icon: Activity,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];
