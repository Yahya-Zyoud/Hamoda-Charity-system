import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ title, children }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar title={title} />
        <div className="dashboard-content animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;