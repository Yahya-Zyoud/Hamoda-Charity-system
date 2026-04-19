import { useState } from "react";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp } from "lucide-react";
import { subscribeEmail } from "../services/api";

const footerLinks = {
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

const socialLinks = [
  { icon: Facebook, label: "فيسبوك", href: "#", color: "hover:bg-blue-600" },
  { icon: Twitter, label: "تويتر", href: "#", color: "hover:bg-sky-500" },
  { icon: Instagram, label: "إنستغرام", href: "#", color: "hover:bg-pink-600" },
  { icon: Youtube, label: "يوتيوب", href: "#", color: "hover:bg-red-600" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setStatus("error");
      setMessage("الرجاء إدخال بريد إلكتروني صحيح");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await subscribeEmail(email.trim());
      setStatus("success");
      setMessage(res.message || "تم الاشتراك بنجاح!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "حدث خطأ، يرجى المحاولة لاحقاً");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">

      <div className="bg-gradient-to-r from-blue-700 to-green-600 py-10 relative z-10">

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>

            <h3 className="text-2xl font-black text-white mb-1">
              اشترك في نشرتنا البريدية
            </h3>

            <p className="text-green-100 text-sm">
              كن أول من يعلم بمشاريعنا ونشاطاتنا الخيرية
            </p>

          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); setMessage(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="بريدك الإلكتروني..."
                disabled={status === "loading"}
                dir="rtl"
                className="flex-1 md:w-72 px-5 py-3 rounded-2xl text-gray-800 bg-white font-medium outline-none border-2 border-transparent focus:border-green-300 text-right disabled:opacity-60"
              />

              <button
                onClick={handleSubscribe}
                disabled={status === "loading"}
                className="px-6 py-3 rounded-2xl bg-white text-green-700 font-black hover:bg-green-50 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {status === "loading" ? (
                  <span className="w-4 h-4 border-2 border-green-300 border-t-green-700 rounded-full animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                اشترك
              </button>
            </div>

            {message && (
              <p className={`text-xs font-semibold text-right pr-1 ${
                status === "success" ? "text-green-100" : "text-red-200"
              }`}>
                {status === "success" ? "✅ " : "❌ "}{message}
              </p>
            )}
          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>

              <div>
                <p className="font-black text-white text-lg leading-tight">
                  جمعية حمودة الخيرية
                </p>
                <p className="text-green-400 text-xs font-medium">
                  معًا نصنع الفرق
                </p>
                
              </div>

            </div>

            <p className="text-gray-400 mb-6 text-sm max-w-xs">
              جمعية حمودة الخيرية هي منظمة غير ربحية تهدف إلى تقديم الدعم والمساعدة
              للمحتاجين في فلسطين من خلال مشاريع تنموية وخيرية مستدامة.
            </p>

            <div className="space-y-3">

              {[
                { icon: Phone, text: "0599181853", href: "https://wa.me/972599181853" },
                { icon: Mail, text: "muradaydi06@gmail.com", href: "mailto:muradaydi06@gmail.com" },
                { icon: MapPin, text: "نابلس, Palestine", href: "https://maps.google.com/?q=نابلس,Palestine" },
              ].map(({ icon: Icon, text, href }, i) => (

                <a
                  key={i}
                  href={href}
                  className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors text-sm group"
                >

                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-green-900 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>

                  {text}

                </a>

              ))}

            </div>

          </div>

          {Object.entries(footerLinks).map(([title, links]) => (

            <div key={title}>

              <h4 className="font-black text-white text-base mb-4 flex items-center gap-2">

                <span className="w-1 h-5 bg-gradient-to-b from-green-400 to-teal-400 rounded-full" />

                {title}

              </h4>

              <ul className="space-y-2.5">

                {links.map((link) => (

                  <li key={link.label}>

                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >

                      <span className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-green-400 rounded-full transition-colors" />

                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">

            <span className="text-gray-500 text-sm">تابعنا على:</span>

            {socialLinks.map(({ icon: Icon, label, href, color }) => (

              <a
                key={label}
                href={href}
                aria-label={label}
                className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 ${color} hover:text-white transition-all duration-300 hover:scale-110`}
              >

                <Icon className="w-5 h-5" />

              </a>

            ))}

          </div>

          <p className="text-gray-500 text-sm text-center">
            © 2025 جمعية حمودة الخيرية. جميع الحقوق محفوظة.
            <span className="mx-2">|</span>
            صُنع بـ
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-1" />
            لخدمة المجتمع
          </p>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>

        </div>

      </div>

    </footer>
  );
}