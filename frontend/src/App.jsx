import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/home/HomePage";
import Project from "./pages/Project";
import TeamWork from "./pages/TeamWork";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import HelpRequestPage from "./pages/HelpRequestPage";
import UserProfilePage from "./pages/UserProfilePage";

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

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/help" element={
          <>
            <Navbar />
            <HelpRequestPage />
            <Footer />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Navbar />
            <UserProfilePage />
            <Footer />
          </>
        } />
        <Route path="/donations" element={<Navigate to="/#projects" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
