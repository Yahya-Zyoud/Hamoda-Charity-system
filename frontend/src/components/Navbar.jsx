
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { navItems, getNavIcon } from "../constants/navigation";
import { useAppAuth } from "../contexts/AppAuthContext";
import { isClerkConfigured } from "../lib/clerkConfig";
import { useClerkSignInButton } from "../hooks/useClerkSignInButton";

function AuthButtons({ mobile = false }) {
  const { user, isAdmin, signOut } = useAppAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  if (!isClerkConfigured) return null;

  if (user) {
    const displayName = user.fullName || user.firstName || "المستخدم";
    const initials = (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase();

    if (mobile) {
      return (
        <div className="mt-3 px-3">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-11 w-11 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-black">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1 text-right">
              <div className="truncate text-sm font-black text-slate-800">{displayName}</div>
              <div className="text-xs text-slate-500">{isAdmin ? "مشرف النظام" : "حساب مسجل"}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {isAdmin && (
              <Link
                to="/admin/dashboard/overview"
                className="flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-100"
              >
                <LayoutDashboard size={16} />
                لوحة التحكم
              </Link>
            )}

            <button
              onClick={signOut}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      );
    }

    return (
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`flex items-center gap-2 rounded-full bg-white py-1.5 pr-1.5 pl-3 shadow-sm transition-all hover:shadow-md ${
            isAdmin
              ? "border-2 border-teal-400 hover:border-teal-500"
              : "border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="relative shrink-0">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-black text-white ${isAdmin ? "bg-gradient-to-br from-teal-500 to-cyan-600" : "bg-blue-600"}`}>
                {initials}
              </div>
            )}
            {isAdmin && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 ring-2 ring-white text-[9px] font-black text-white">✓</span>
            )}
          </div>

          <div className="text-right leading-tight">
            <div className="max-w-28 truncate text-sm font-black text-slate-800">{displayName}</div>
            {isAdmin ? (
              <span className="inline-block text-[11px] font-bold text-teal-600">مشرف النظام</span>
            ) : (
              <span className="text-xs text-slate-500">حسابي</span>
            )}
          </div>

          <ChevronDown
            size={16}
            className={`transition-transform ${menuOpen ? "rotate-180" : ""} ${isAdmin ? "text-teal-500" : "text-slate-500"}`}
          />
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-[calc(100%+0.75rem)] z-50 min-w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            {isAdmin && (
              <Link
                to="/admin/dashboard/overview"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50"
              >
                <LayoutDashboard size={16} />
                لوحة التحكم
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${mobile ? "mt-3 px-3" : ""}`}>
      <ClerkSignInBtn />
    </div>
  );
}

function ClerkSignInBtn() {
  const SignIn = useClerkSignInButton(true);

  if (!SignIn) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-5 py-2.5 font-bold text-gray-700 opacity-70 transition-colors cursor-not-allowed"
      >
        تسجيل الدخول
      </button>
    );
  }

  return (
    <SignIn mode="modal">
      <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer">
        تسجيل الدخول
      </button>
    </SignIn>
  );
}

const Navbar = () => {
  const [active, setActive] = useState(() => {
    const hash = window.location.hash || "#home";
    const currentItem = navItems.find((item) => `#${item.path.split("#")[1]}` === hash);
    return currentItem?.label || "الرئيسية";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="relative w-full">
      <nav className="border-b border-gray-100 bg-white px-6 py-4 shadow-md md:px-10">
        <div className="flex w-full items-center justify-between gap-8">
          <a href="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-1 md:h-24 md:w-24">
              <img
                src="/images/logo.webp"
                alt="logo"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <div className="text-right">
              <p className="bg-gradient-to-l from-green-500 to-blue-500 bg-clip-text text-base font-extrabold text-transparent transition-all duration-300 group-hover:scale-105 md:text-xl">
                جمعية حمودة الخيرية
              </p>
              <span className="block text-center text-sm text-gray-500 group-hover:text-gray-700 md:text-base">
                معاً نصنع الفرق
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-4 xl:flex">
            {navItems.map((item) => {
              const isActiveItem = active === item.label;
              const Icon = getNavIcon(item.label);

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActive(item.label);
                    navigate(item.path);
                  }}
                  className={`relative group flex items-center gap-2 px-3 py-2 text-base transition-colors ${
                    isActiveItem ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 right-0 left-0 h-0.5 origin-right bg-blue-600 transition-transform ${
                      isActiveItem ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="hidden items-center ps-3 xl:flex">
            <AuthButtons />
          </div>

          <button
            className="cursor-pointer text-gray-600 xl:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-gray-100 pb-3 pt-2 xl:hidden" dir="rtl">
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
                  className={`flex items-center gap-2 px-4 py-2 text-base ${
                    active === item.label ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <AuthButtons mobile />
          </div>
        )}
      </nav>

      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-600" />
    </header>
  );
};

export default Navbar;
