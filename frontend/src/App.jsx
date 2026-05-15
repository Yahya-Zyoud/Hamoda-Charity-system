import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/home/HomePage";
import Project from "./pages/Project";
import TeamWork from "./pages/TeamWork";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import HelpRequest from "./pages/HelpRequest";
import AboutUs from "./pages/AboutUs";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        {/* Public — with Navbar + Footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        } />

        {/* Mohamed's pages */}
        <Route path="/projects" element={<Project />} />
        <Route path="/team" element={<TeamWork />} />

        {/* Ahmad's pages */}
        <Route path="/help-request" element={<HelpRequest />} />
        <Route path="/about" element={<AboutUs />} />

        {/* User profile */}
        <Route path="/profile" element={<UserProfilePage />} />

        {/* Admin dashboard — only for users with role: "admin" in Clerk metadata */}
        <Route path="/admin/dashboard/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="/admin/login" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/donations" element={<Navigate to="/#projects" replace />} />
        <Route path="/help" element={<Navigate to="/help-request" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
