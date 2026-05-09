import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/Home/home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
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

        <Route path="/admin/dashboard/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
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
