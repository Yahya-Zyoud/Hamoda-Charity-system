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
    <>
      <div className="h-3 bg-blue-600" />

      <nav className="bg-white shadow-sm px-6 py-1">

        <div className="flex items-center">

          <a href="/" className="flex items-center gap-3 shrink-0">
            <img src="/images/logo.webp" alt="logo" className="w-14 h-14 md:w-20 md:h-24 object-contain" />


            <div>
              <p className="text-base md:text-xl font-extrabold bg-gradient-to-l from-green-500 to-blue-500 bg-clip-text text-transparent">
                جمعية حمودة الخيرية
              </p>
              <span className="text-sm md:text-base text-gray-500 text-center block">معًا نصنع الفرق</span>
            </div>
          </a>

          <div className="hidden md:flex flex-1 justify-center" dir="rtl">
            {navItems.map((item) => {
              const isActive = active === item.label;
              let textColor;
              if (isActive) {
                textColor = "text-blue-600";
              } 
              else {
                textColor = "text-gray-600 hover:text-blue-600";
              }

              let underline;
              if (isActive) {
                underline = "scale-x-100";
              } 
              else {
                underline = "scale-x-0 group-hover:scale-x-100";
              }

              return (
                <button
                  key={item.label}
                  onClick={() => setActive(item.label)}
                  className={`relative group flex items-center gap-2 px-4 py-2 text-base cursor-pointer ${textColor}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <span className={`absolute bottom-0 right-0 left-0 h-0.5 bg-blue-600 transition-transform origin-right ${underline}`} />
                </button>
              );
            })}
          </div>


          <div className="hidden md:flex shrink-0 w-64 justify-end items-center gap-3">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold cursor-pointer group">
              <Lock size={15} className="group-hover:scale-110 transition-transform" />
              تسجيل الدخول
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition-colors font-bold cursor-pointer">
              تبرع الآن
            </button>
          </div>

          <button className="md:hidden mr-auto text-gray-600 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        {
          menuOpen && (
            <div className="md:hidden flex flex-col gap-1 pb-3 pt-1 border-t border-gray-100" dir="rtl">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActive(item.label); setMenuOpen(false); }}
                  className={`flex items-center gap-2 px-4 py-2 text-base cursor-pointer
                  ${active === item.label ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="flex items-center gap-3 mt-2">

                <button className="flex items-center gap-2 text-gray-600 px-3 py-2 text-sm font-semibold cursor-pointer">
                  <Lock size={18} /> تسجيل الدخول
                </button>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold cursor-pointer">
                  تبرع الآن
                </button>
              </div>
            </div>
          )}
      </nav>
    </>
  );
};

export default Navbar;