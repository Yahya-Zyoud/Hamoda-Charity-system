import { Routes, Route, Navigate } from "react-router-dom";
import "../../styles/admin.css";
import OverviewPage from "./OverviewPage";
import RequestsPage from "./RequestsPage";
import ProjectsPage from "./ProjectsPage";
import DonationsPage from "./DonationsPage";
import UsersPage from "./UsersPage";
import NotificationsPage from "./NotificationsPage";
import ReportsPage from "./ReportsPage";

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="overview" />} />
      <Route path="overview" element={<OverviewPage />} />
      <Route path="requests" element={<RequestsPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="donations" element={<DonationsPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="reports" element={<ReportsPage />} />
    </Routes>
  );
}

export default AdminDashboard;