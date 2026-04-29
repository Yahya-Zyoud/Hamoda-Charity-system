import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ title, children, showHeader = true }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        {showHeader && <Topbar title={title} />}
        <div className="dashboard-content animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
