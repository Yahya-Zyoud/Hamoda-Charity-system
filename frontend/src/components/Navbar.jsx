import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Menu, X } from "lucide-react";
import { navItems, getNavIcon } from "../constants/navigation";

const Navbar = () => {
  const [active, setActive] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header className="relative w-full">
      <nav className="bg-white shadow-md px-6 py-3 border-b border-gray-100">
        <div className="flex items-center w-full justify-between">

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {localStorage.getItem("isAdmin") === "true" ? (
              <button
                onClick={() => {
                  localStorage.removeItem("isAdmin");
                  navigate("/");
                  window.location.reload(); // Refresh to update navbar state
                }}
                className="relative flex items-center gap-2 px-5 py-2.5 text-red-600 font-tajawal font-bold rounded-lg border border-red-100 hover:bg-red-50 transition-all duration-200 hover:scale-105 shadow-sm group cursor-pointer"
              >
                <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                تسجيل الخروج
              </button>
            ) : (
              <button
                onClick={() => navigate("/admin/login")}
                className="relative flex items-center gap-2 px-5 py-2.5 text-gray-700 font-tajawal font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-sm group cursor-pointer"
              >
                <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                تسجيل الدخول
              </button>
            )}

            <button
              onClick={() => navigate("/profile")}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-l from-blue-600 to-blue-500 text-white font-tajawal font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 group cursor-pointer"
            >
              <User size={18} />
              الملف الشخصي
            </button>

          </div>

          <div className="hidden md:flex gap-1" dir="rtl">
            {navItems.map((item) => {
              const isActive = active === item.label;
              const Icon = getNavIcon(item.label);

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActive(item.label);
                    navigate(item.path);
                  }}
                  className={`relative group flex items-center gap-2 px-4 py-2 text-base cursor-pointer transition-colors ${isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  {Icon && <Icon size={20} />}
                  <span>{item.label}</span>

                  <span
                    className={`absolute bottom-0 right-0 left-0 h-0.5 bg-blue-600 transition-transform origin-right ${isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Logo & Brand */}
          <a href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="text-right">
              <p className="text-base md:text-xl font-extrabold bg-gradient-to-l from-green-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                جمعية حمودة الخيرية
              </p>

              <span className="text-sm md:text-base text-gray-500 block text-center group-hover:text-gray-700">
                معًا نصنع الفرق
              </span>
            </div>

            <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-white p-1">
              <img
                src="/images/logo.webp"
                alt="logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </a>

          <button
            className="md:hidden text-gray-600 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden flex flex-col gap-1 pb-3 pt-2 border-t border-gray-100"
            dir="rtl"
          >
            {navItems.map((item) => {
              const Icon = getNavIcon(item.label);
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActive(item.label);
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-base cursor-pointer ${active === item.label
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  {Icon && <Icon size={20} />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="flex items-center gap-3 mt-3 px-3">
              {localStorage.getItem("isAdmin") === "true" ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("isAdmin");
                    navigate("/");
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 cursor-pointer"
                >
                  <Lock size={16} />
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/admin/login");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border text-gray-700 cursor-pointer"
                >
                  <Lock size={16} />
                  تسجيل الدخول
                </button>
              )}

              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-bold cursor-pointer"
              >
                <User size={16} />
                الملف الشخصي
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-600" />
    </header>
  );
};

export default Navbar;
