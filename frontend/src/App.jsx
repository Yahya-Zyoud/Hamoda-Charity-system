import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/Profile/ProfilePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <Routes>
      {/* Public Routes with Navbar & Footer */}
      <Route
        path="/"
        element={
          <div>
            <Navbar />
            <HomePage />
            <Footer />
          </div>
        }
      />
      <Route
        path="/profile"
        element={
          <div>
            <Navbar />
            <ProfilePage />
            <Footer />
          </div>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
