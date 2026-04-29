import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  HandCoins,
  Users,
  BarChart3,
  Bell,
  Heart,
  LogOut,
  Home,
} from "lucide-react";
import { useAppAuth } from "../../contexts/AppAuthContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard/overview",      label: "نظرة عامة",       icon: LayoutDashboard, color: "#60A5FA" },
  { to: "/admin/dashboard/requests",      label: "الطلبات",          icon: ClipboardList,   color: "#FBBF24" },
  { to: "/admin/dashboard/projects",      label: "المشاريع",         icon: Briefcase,       color: "#A78BFA" },
  { to: "/admin/dashboard/donations",     label: "التبرعات",         icon: HandCoins,       color: "#34D399" },
  { to: "/admin/dashboard/users",         label: "المستخدمون",       icon: Users,           color: "#38BDF8" },
  { to: "/admin/dashboard/reports",       label: "التقارير",         icon: BarChart3,       color: "#F87171" },
  { to: "/admin/dashboard/notifications", label: "الإشعارات",        icon: Bell,            color: "#FB923C" },
];

function Sidebar({ mobileOpen }) {
  const location = useLocation();
  const { signOut, user } = useAppAuth();
  const displayName = user?.fullName || user?.firstName || "المشرف";

  return (
    <div className={`dashboard-sidebar${mobileOpen ? " open" : ""}`}>

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <Heart size={20} fill="currentColor" />
        </div>
        <div>
          <div className="sidebar-brand-name">جمعية حمودة</div>
          <div className="sidebar-brand-sub">الخيرية</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">القائمة الرئيسية</div>
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <span
                className="sidebar-link-icon"
                style={{
                  background: isActive ? `${item.color}22` : "transparent",
                  color: isActive ? item.color : "rgba(148,163,184,0.7)",
                }}
              >
                <Icon size={15} strokeWidth={2} />
              </span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Back to site */}
      <a
        href="/"
        className="sidebar-back-link"
        title="العودة إلى الموقع الرئيسي"
      >
        <Home size={15} strokeWidth={2} />
        <span>العودة للموقع</span>
      </a>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">
          {user?.imageUrl
            ? <img src={user.imageUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            : displayName[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-footer-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
          <div className="sidebar-footer-role">مدير النظام</div>
        </div>
        <button className="sidebar-footer-logout" title="تسجيل الخروج" onClick={signOut}>
          <LogOut size={15} strokeWidth={2} />
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
