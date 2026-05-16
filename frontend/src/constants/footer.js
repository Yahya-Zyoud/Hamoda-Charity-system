import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

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
  { icon: FaFacebook, label: "فيسبوك", href: "#", color: "hover:bg-blue-600" },
  { icon: FaTwitter, label: "تويتر", href: "#", color: "hover:bg-sky-500" },
  { icon: FaInstagram, label: "إنستغرام", href: "#", color: "hover:bg-pink-600" },
  { icon: FaYoutube, label: "يوتيوب", href: "#", color: "hover:bg-red-600" },
];

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
