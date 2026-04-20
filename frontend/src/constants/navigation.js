import {
  Heart,
  Users,
  FolderOpen,
  HelpCircle,
} from "lucide-react";

export const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "الفريق", path: "/team" },
  { label: "المشاريع", path: "/projects" },
  { label: "المنح والتبرعات", path: "/donations" },
  { label: "طلب مساعدة", path: "/help" },
];

export const getNavIcon = (label) => {
  const iconMap = {
    "الرئيسية": Heart,
    "الفريق": Users,
    "المشاريع": FolderOpen,
    "طلب مساعدة": HelpCircle,
  };
  return iconMap[label] || null;
};
