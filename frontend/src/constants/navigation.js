// Navbar items and icon lookup for the main navigation
import {
  Home,
  Users,
  FolderOpen,
  HelpCircle,
  Heart,
} from "lucide-react";

export const navItems = [
  { label: "الرئيسية", path: "/#home" },
  { label: "المشاريع", path: "/projects" },
  { label: "المنح والتبرعات", path: "/donations" },
  { label: "طلب مساعدة", path: "/help-request" },
  { label: "الفريق", path: "/team" },
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
