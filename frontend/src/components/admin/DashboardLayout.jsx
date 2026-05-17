// Shell layout that wraps every admin page with a persistent sidebar and an optional topbar.
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
