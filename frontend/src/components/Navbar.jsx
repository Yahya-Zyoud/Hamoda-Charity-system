import { useState } from "react";
import { Heart, Users, FolderOpen, Link, HelpCircle, Lock, Menu, X } from "lucide-react";

const Navbar = () => {
  const [active, setActive] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "الرئيسية", icon: <Heart size={20} /> },
    { label: "الفريق", icon: <Users size={20} /> },
    { label: "المشاريع", icon: <FolderOpen size={20} /> },
    { label: "المنح والتبرعات", icon: <Link size={20} /> },
    { label: "طلب مساعدة", icon: <HelpCircle size={20} /> },
  ];

  return (
    <header className="relative w-full">
      <nav className="bg-white shadow-sm px-6 py-2">

        <div className="flex items-center w-full justify-between">

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">

            <button className="relative flex items-center gap-2 px-5 py-2 text-gray-700 font-semibold rounded-full border border-gray-200 hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-sm group overflow-hidden cursor-pointer">
              <Lock size={16} className="group-hover:rotate-12 transition-transform" />
              تسجيل الدخول
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
            </button>

            <button className="relative px-6 py-2 rounded-full bg-gradient-to-l from-blue-600 to-green-500 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group overflow-hidden cursor-pointer">
              تبرع الآن
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/70 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
            </button>

          </div>

          {/* Nav Items */}
          <div className="hidden md:flex gap-1" dir="rtl">
            {navItems.map((item) => {
              const isActive = active === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setActive(item.label)}
                  className={`relative group flex items-center gap-2 px-4 py-2 text-base cursor-pointer transition-colors
                  ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  {item.icon}
                  <span>{item.label}</span>

                  <span
                    className={`absolute bottom-0 right-0 left-0 h-0.5 bg-blue-600 transition-transform origin-right
                    ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="text-right">
              <p className="text-base md:text-xl font-extrabold bg-gradient-to-l from-green-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                جمعية حمودة الخيرية
              </p>
              <span className="text-sm md:text-base text-gray-500 block group-hover:text-gray-700 transition-colors">
                معًا نصنع الفرق
              </span>
            </div>

            {/* LOGO UPDATED */}
            <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-md p-1">
              <img
                src="/images/logo.webp"
                alt="logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-1 pb-3 pt-2 border-t border-gray-100" dir="rtl">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActive(item.label);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-base cursor-pointer
                ${active === item.label ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <div className="flex items-center gap-3 mt-3 px-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-gray-700 cursor-pointer">
                <Lock size={16} />
                تسجيل الدخول
              </button>

              <button className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold cursor-pointer">
                تبرع الآن
              </button>
            </div>
          </div>
        )}

      </nav>

      {/* Gradient Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-600" />
    </header>
  );
};

export default Navbar;