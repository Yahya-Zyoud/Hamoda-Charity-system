import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DonationSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ minHeight: "70vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "40px 32px", maxWidth: 540, width: "100%", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,.06)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={48} color="#16a34a" />
          </div>
          <h1 style={{ color: "#0f172a", fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>
            تم استلام تبرعك بنجاح
          </h1>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8, margin: "0 0 20px" }}>
            شكراً جزيلاً على دعمك الكريم. تم تأكيد عملية الدفع وسنرسل إيصالاً إلى بريدك الإلكتروني خلال دقائق.
          </p>
          {sessionId && (
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 24 }}>
              رقم العملية: <code style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>{sessionId.slice(-12)}</code>
            </p>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/projects" style={{ background: "#1856FF", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>
              تصفح المشاريع
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
