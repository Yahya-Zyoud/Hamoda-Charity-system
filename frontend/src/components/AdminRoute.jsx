import { Navigate, Link } from "react-router-dom";
import { useAppAuth } from "../contexts/AppAuthContext";

function AdminRoute({ children }) {
  const { user, isAdmin, isLoaded } = useAppAuth();

  if (!isLoaded) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <span style={{ color: "#64748b", fontSize: "0.95rem" }}>جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/?signin=1" replace />;
  }

  if (!isAdmin) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "3rem" }}>🔒</span>
        <h2 style={{ color: "#0f172a", fontSize: "1.5rem", fontWeight: 800 }}>
          هذه الصفحة مخصصة للمشرفين فقط
        </h2>
        <p style={{ color: "#64748b", maxWidth: "420px" }}>
          يبدو أنك مسجل دخول ولكن ليس لديك صلاحية الوصول إلى لوحة التحكم. تواصل مع مسؤول النظام لمنحك صلاحية المشرف.
        </p>
        <Link
          to="/"
          style={{
            background: "#1856FF",
            color: "white",
            padding: "12px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
