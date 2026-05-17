import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export const footerLinks = {
  "روابط سريعة": [
    { label: "الرئيسية", href: "/" },
    { label: "مشاريعنا", href: "/projects" },
    { label: "من نحن", href: "/about" },
    { label: "فريق العمل", href: "/team" },
  ],
  "خدماتنا": [
    { label: "تقديم طلب مساعدة", href: "/help-request" },
    { label: "تبرع الآن", href: "/donations" },
    { label: "التطوع معنا", href: "/volunteer" },
  ],
};

export const socialLinks = [
  { icon: FaFacebook, label: "فيسبوك", href: "#", color: "hover:bg-blue-600" },
  { icon: FaTwitter, label: "تويتر", href: "#", color: "hover:bg-sky-500" },
  { icon: FaInstagram, label: "إنستغرام", href: "#", color: "hover:bg-pink-600" },
  { icon: FaYoutube, label: "يوتيوب", href: "#", color: "hover:bg-red-600" },
];

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
