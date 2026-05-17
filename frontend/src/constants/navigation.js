// Navbar items and icon lookup for the main navigation
import {
  Home,
  Users,
  FolderOpen,
  HelpCircle,
  Heart,
  Info,
} from "lucide-react";

export const navItems = [
  { label: "الرئيسية", path: "/#home" },
  { label: "من نحن", path: "/about" },
  { label: "المشاريع", path: "/projects" },
  { label: "المنح والتبرعات", path: "/donations" },
  { label: "طلب مساعدة", path: "/help-request" },
  { label: "الفريق", path: "/team" },
];

export const getNavIcon = (label) => {
  const iconMap = {
    الرئيسية: Home,
    "من نحن": Info,
    الفريق: Users,
    المشاريع: FolderOpen,
    "المنح والتبرعات": Heart,
    "طلب مساعدة": HelpCircle,
  };

  return iconMap[label] || null;
};
