import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main
        dir="rtl"
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "40px 20px",
          background: "#F8FAFC",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 900, color: "#E2E8F0", lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: 0 }}>
          الصفحة غير موجودة
        </h1>
        <p style={{ color: "#64748B", maxWidth: 360, fontSize: 15, margin: 0 }}>
          يبدو أن الرابط الذي أدخلته غير صحيح أو أن الصفحة قد تم نقلها.
        </p>
        <Link
          to="/"
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "10px 28px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            marginTop: 8,
          }}
        >
          العودة إلى الرئيسية
        </Link>
      </main>
      <Footer />
    </>
  );
}

export default NotFoundPage;
