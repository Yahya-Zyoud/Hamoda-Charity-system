import { useState } from "react";
import { CheckCircle2, HandHeart, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitVolunteer } from "../services/api";

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  skills: "",
  availability: "",
  note: "",
};

export default function VolunteerPage() {
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.fullName.trim().length < 3) return setError("الاسم يجب أن يكون 3 أحرف على الأقل.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("البريد الإلكتروني غير صحيح.");
    if (!/^05\d{8}$/.test(form.phone)) return setError("رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.");

    setLoading(true);
    try {
      await submitVolunteer(form);
      setSuccess(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err?.message || "تعذّر إرسال الطلب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 64 }}>
        <section style={{ background: "linear-gradient(135deg, #1856FF 0%, #07CA6B 100%)", padding: "60px 20px 80px", color: "white", textAlign: "center" }}>
          <HandHeart size={42} style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 10px" }}>تطوّع معنا</h1>
          <p style={{ fontSize: 15, maxWidth: 540, margin: "0 auto", opacity: 0.95 }}>
            ساهم بوقتك ومهاراتك في صنع الفرق. سجّل بياناتك وسنتواصل معك لمطابقتك مع الفرصة المناسبة.
          </p>
        </section>

        <div style={{ maxWidth: 720, margin: "-40px auto 0", padding: "0 20px" }}>
          <div style={{ background: "white", borderRadius: 18, padding: 28, boxShadow: "0 12px 40px rgba(0,0,0,.06)" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "24px 12px" }}>
                <CheckCircle2 size={56} color="#16a34a" style={{ marginBottom: 12 }} />
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>تم استلام طلبك</h2>
                <p style={{ color: "#475569", margin: "0 0 18px" }}>سيتواصل معك فريقنا قريباً لمناقشة الفرص المتاحة. شكراً لك!</p>
                <button onClick={() => setSuccess(false)} style={{ background: "#1856FF", color: "white", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
                  تقديم طلب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>بيانات المتطوع</h2>
                {error && (
                  <div style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
                    ⚠ {error}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { name: "fullName", label: "الاسم الكامل *", placeholder: "اكتب اسمك الكامل" },
                    { name: "email",    label: "البريد الإلكتروني *", placeholder: "example@email.com", type: "email" },
                    { name: "phone",    label: "رقم الهاتف *", placeholder: "0599000000", type: "tel" },
                    { name: "city",     label: "المدينة", placeholder: "مثال: نابلس" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                      <input
                        type={f.type || "text"}
                        name={f.name}
                        placeholder={f.placeholder}
                        value={form[f.name]}
                        onChange={handleChange}
                        style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 6, fontWeight: 600 }}>المهارات</label>
                  <input
                    name="skills"
                    placeholder="مثال: تصميم، برمجة، توعية مجتمعية، إدارة، تدريس..."
                    value={form.skills}
                    onChange={handleChange}
                    style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 6, fontWeight: 600 }}>أوقات التفرغ</label>
                  <input
                    name="availability"
                    placeholder="مثال: نهايات الأسبوع، 5 ساعات أسبوعياً..."
                    value={form.availability}
                    onChange={handleChange}
                    style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 6, fontWeight: 600 }}>ملاحظات إضافية</label>
                  <textarea
                    name="note"
                    rows={3}
                    placeholder="أي معلومات تودّ مشاركتها..."
                    value={form.note}
                    onChange={handleChange}
                    style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 22,
                    width: "100%",
                    background: "linear-gradient(135deg,#1856FF,#07CA6B)",
                    color: "white",
                    border: "none",
                    padding: "13px 16px",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading ? <><Loader2 size={16} className="spin" /> جاري الإرسال...</> : "إرسال طلب التطوع"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
