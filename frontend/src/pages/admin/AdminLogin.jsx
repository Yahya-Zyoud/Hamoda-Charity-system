import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validate()) return;

    if (form.email === "admin@charity.com" && form.password === "123456") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard/overview");
    } else {
      setLoginError("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">🤲</div>
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
          <button type="submit" className="login-btn">
            تسجيل الدخول
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