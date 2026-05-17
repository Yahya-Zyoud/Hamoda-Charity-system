import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DonationCancel() {
  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ minHeight: "70vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "40px 32px", maxWidth: 540, width: "100%", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,.06)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <XCircle size={48} color="#dc2626" />
          </div>
          <h1 style={{ color: "#0f172a", fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>
            تم إلغاء عملية الدفع
          </h1>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8, margin: "0 0 24px" }}>
            لم يتم خصم أي مبلغ. يمكنك المحاولة مجدداً في أي وقت — كل مساهمة لها أثر.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/donations" style={{ background: "#1856FF", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>
              المحاولة مرة أخرى
            </Link>
            <Link to="/" style={{ background: "white", color: "#1856FF", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, border: "1px solid #1856FF" }}>
              العودة إلى الرئيسية
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
