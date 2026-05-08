import {
  Home,
  Users,
  FolderOpen,
  HelpCircle,
  Heart,
} from "lucide-react";

export const navItems = [
  { label: "الرئيسية", path: "/#home" },
  { label: "المشاريع", path: "/#projects" },
  { label: "المنح والتبرعات", path: "/donations" },
  { label: "طلب مساعدة", path: "/#services" },
  { label: "الفريق", path: "/#partners" },
];

export const getNavIcon = (label) => {
  const iconMap = {
    الرئيسية: Home,
    الفريق: Users,
    المشاريع: FolderOpen,
    "المنح والتبرعات": Heart,
    "طلب مساعدة": HelpCircle,
  };

  return iconMap[label] || null;
};
