import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/home/HomePage";
import AdminRoute from "./components/AdminRoute";

// Lazy-load every non-home route so the initial bundle is small.
// Admin in particular brings in Recharts, Framer Motion and the whole
// dashboard tree — public visitors should never download it.
const Project          = lazy(() => import("./pages/Project"));
const TeamWork         = lazy(() => import("./pages/TeamWork"));
const ProjectDetail    = lazy(() => import("./pages/ProjectDetail"));
const HelpRequest      = lazy(() => import("./pages/HelpRequest"));
const AboutUs          = lazy(() => import("./pages/AboutUs"));
const VolunteerPage    = lazy(() => import("./pages/VolunteerPage"));
const UserProfilePage  = lazy(() => import("./pages/UserProfilePage"));
const DonationPage     = lazy(() => import("./pages/Donation_page/Home"));
const DonationSuccess  = lazy(() => import("./pages/Donation_page/Success"));
const DonationCancel   = lazy(() => import("./pages/Donation_page/Cancel"));
const NotFoundPage     = lazy(() => import("./pages/NotFoundPage"));
const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard"));

function PageFallback() {
  return (
    <div dir="rtl" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
      جاري التحميل...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Suspense fallback={<PageFallback />}>
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
          <Route path="/projects"     element={<Project />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/team"         element={<TeamWork />} />

          {/* Ahmad's pages */}
          <Route path="/help-request" element={<HelpRequest />} />
          <Route path="/about"        element={<AboutUs />} />
          <Route path="/volunteer"    element={<VolunteerPage />} />

          {/* User profile */}
          <Route path="/profile" element={<UserProfilePage />} />

          {/* Admin dashboard — only for users with role: "admin" in Clerk metadata */}
          <Route path="/admin/dashboard/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="/admin/login"      element={<Navigate to="/" replace />} />
          <Route path="/admin"            element={<Navigate to="/" replace />} />
          <Route path="/donations"        element={<DonationPage />} />
          <Route path="/donations/success" element={<DonationSuccess />} />
          <Route path="/donations/cancel"  element={<DonationCancel />} />
          <Route path="/help"             element={<Navigate to="/help-request" replace />} />
          <Route path="*"                 element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
