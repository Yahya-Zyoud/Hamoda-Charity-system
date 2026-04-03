import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/admin/dashboard/overview",      label: "نظرة عامة",       icon: "📊" },
  { to: "/admin/dashboard/requests",      label: "إدارة الطلبات",   icon: "📋" },
  { to: "/admin/dashboard/projects",      label: "إدارة المشاريع",  icon: "💼" },
  { to: "/admin/dashboard/donations",     label: "إدارة التبرعات",  icon: "💰" },
  { to: "/admin/dashboard/users",         label: "المستخدمون",      icon: "👥" },
  { to: "/admin/dashboard/reports",       label: "التقارير",         icon: "📈" },
  { to: "/admin/dashboard/notifications", label: "الإشعارات",       icon: "🔔" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <div className="dashboard-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🤲</div>
        <div>
          <div className="sidebar-logo-text">جمعية حمودة الخيرية</div>
          <div className="sidebar-logo-sub">لوحة الإدارة</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">القائمة الرئيسية</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout}>
        🚪 تسجيل الخروج
      </button>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-avatar">م</div>
        <div>
          <div className="sidebar-footer-name">المشرف العام</div>
          <div className="sidebar-footer-role">مدير النظام</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;