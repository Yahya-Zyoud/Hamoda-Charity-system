import { useState } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { email: "", password: "" };
    let valid = true;

    if (!form.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
      valid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
      valid = false;
    } else if (form.password.length < 4) {
      newErrors.password = "كلمة المرور قصيرة جداً";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.data?.role === "admin") {
        // Store token and admin flag
        localStorage.setItem("charity_token", data.data.token);
        localStorage.setItem("isAdmin", "true");
        window.location.href = "/admin/dashboard/overview";
      } else if (res.ok && data.success && data.data?.role !== "admin") {
        setLoginError("هذا الحساب ليس لديه صلاحيات المشرف");
        localStorage.removeItem("charity_token");
        localStorage.removeItem("isAdmin");
      } else {
        setLoginError(data.message || "بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى");
      }
    } catch {
      // Fallback: allow demo login with hardcoded credentials if backend is offline
      if (form.email === "admin@charity.com" && form.password === "123456") {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "/admin/dashboard/overview";
      } else {
        setLoginError("تعذر الاتصال بالخادم. تأكد من تشغيل الخادم وحاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo"><HeartHandshake size={32} /></div>
        <h2 className="login-title">جمعية حمودة الخيرية</h2>
        <p className="login-subtitle">أدخل بيانات المشرف للوصول إلى لوحة الإدارة</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="login-field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="admin@charity.com"
              value={form.email}
              className={errors.email ? "error" : ""}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="login-field">
            <label>كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••"
              value={form.password}
              className={errors.password ? "error" : ""}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          {/* Login Error */}
          {loginError && <div className="login-error">{loginError}</div>}

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> جاري التحقق...</span>
              : "تسجيل الدخول"
            }
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#94A3B8" }}>
          معًا نصنع الفرق 💙
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;