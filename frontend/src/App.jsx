import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/home/HomePage";
import Project from "./pages/Project";
import TeamWork from "./pages/TeamWork";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
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

        {/* Admin dashboard — only for users with role: "admin" in Clerk metadata */}
        <Route path="/admin/dashboard/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="/admin/login" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/donations" element={<Navigate to="/#projects" replace />} />
        <Route path="/help" element={<Navigate to="/#services" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
