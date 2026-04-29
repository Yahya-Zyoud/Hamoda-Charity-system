import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToHash from "./Components/ScrollToHash";
import HomePage from "./pages/Home/home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./Components/AdminRoute";

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

        {/* Admin dashboard — only for users with role: "admin" in Clerk metadata */}
        <Route path="/admin/dashboard/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/* Redirect any stale /admin/login links to home */}
        <Route path="/admin/login" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/team" element={<Navigate to="/#partners" replace />} />
        <Route path="/projects" element={<Navigate to="/#projects" replace />} />
        <Route path="/donations" element={<Navigate to="/#projects" replace />} />
        <Route path="/help" element={<Navigate to="/#services" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
