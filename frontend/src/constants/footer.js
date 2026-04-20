import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const footerLinks = {
  "روابط سريعة": [
    { label: "الرئيسية", href: "#home" },
    { label: "مشاريعنا", href: "#projects" },
    { label: "من نحن", href: "#about" },
    { label: "تقاريرنا السنوية", href: "#reports" },
    { label: "فريق العمل", href: "#team" },
  ],
  "خدماتنا": [
    { label: "تقديم طلب مساعدة", href: "#help" },
    { label: "كفالة يتيم", href: "#orphan" },
    { label: "كفالة طالب", href: "#student" },
    { label: "زكاة وصدقات", href: "#zakat" },
    { label: "التطوع معنا", href: "#volunteer" },
  ],
};

export const socialLinks = [
  { icon: Facebook, label: "فيسبوك", href: "#", color: "hover:bg-blue-600" },
  { icon: Twitter, label: "تويتر", href: "#", color: "hover:bg-sky-500" },
  { icon: Instagram, label: "إنستغرام", href: "#", color: "hover:bg-pink-600" },
  { icon: Youtube, label: "يوتيوب", href: "#", color: "hover:bg-red-600" },
];

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
