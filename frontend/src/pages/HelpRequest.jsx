import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./HelpRequest.css";

function HelpRequest() {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    email: "",
    city: "",
    helpType: "",
    description: "",
    document: null,
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));

    setError("");
    setSubmitted(false);
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (formData.fullName.trim().length < 3) {
    setError("الاسم الكامل يجب أن يكون 3 أحرف على الأقل.");
    return;
  }

  if (!/^\d{9}$/.test(formData.nationalId)) {
    setError("رقم الهوية يجب أن يتكون من 9 أرقام.");
    return;
  }

  if (!/^05\d{8}$/.test(formData.phone)) {
    setError("رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.");
    return;
  }

  if (formData.description.trim().length < 20) {
    setError("وصف الحالة يجب أن يكون 20 حرفًا على الأقل.");
    return;
  }

  try {
    const requestData = new FormData();

    requestData.append("fullName", formData.fullName);
    requestData.append("nationalId", formData.nationalId);
    requestData.append("phone", formData.phone);
    requestData.append("email", formData.email);
    requestData.append("city", formData.city);
    requestData.append("helpType", formData.helpType);
    requestData.append("description", formData.description);

    if (formData.document) {
      requestData.append("document", formData.document);
    }

    const response = await fetch("http://localhost:5000/api/help-requests", {
      method: "POST",
      body: requestData,
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "حدث خطأ أثناء إرسال الطلب.");
      return;
    }

    console.log("Saved request:", data);

    setSubmitted(true);
    setError("");

    setFormData({
      fullName: "",
      nationalId: "",
      phone: "",
      email: "",
      city: "",
      helpType: "",
      description: "",
      document: null,
    });
  } catch (error) {
    console.error("Submit request error:", error);
    setError("تعذر الاتصال بالخادم. تأكد أن الباك إند يعمل.");
  }
}

  return (
    <>
      <Navbar />

      <main className="help-request-page">
          <img
            src="/images/help-request-left.png"
            alt=""
            className="help-bg-img help-bg-left"
          />

          <img
            src="/images/help-request-right.png"
            alt=""
            className="help-bg-img help-bg-right"
          />
        <section className="help-hero">
          <div className="hero-decor hero-decor-right"></div>
          <div className="hero-decor hero-decor-left"></div>

          <div className="help-hero-content">
            <span className="help-badge">طلب مساعدة</span>
            <h1>نموذج طلب المساعدة</h1>
            <p>
              قم بتعبئة النموذج التالي بشكل واضح، وسيتم مراجعة طلبك من قبل إدارة
              الجمعية والتواصل معك عند الحاجة.
            </p>
          </div>
        </section>

        <section className="help-content">
          <aside className="help-info-card">
            <h2>قبل إرسال الطلب</h2>
            <p>
              يرجى التأكد من إدخال معلومات صحيحة، وشرح الحالة بشكل واضح، وإرفاق
              أي مستند يساعد الإدارة على مراجعة الطلب.
            </p>

            <div className="help-info-list">
              <div className="help-info-item">
                <span>1</span>
                <p>اكتب بياناتك الشخصية بشكل صحيح.</p>
              </div>

              <div className="help-info-item">
                <span>2</span>
                <p>اختر نوع المساعدة المناسب لحالتك.</p>
              </div>

              <div className="help-info-item">
                <span>3</span>
                <p>أرفق صورة أو ملف إثبات إن وجد.</p>
              </div>
            </div>
          </aside>

          <section className="help-form-card">
            <div className="form-title">
              <h2>بيانات الطلب</h2>
              <p>الحقول التي تحتوي على * مطلوبة.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {submitted && (
              <div className="success-message">
                تم إرسال طلبك بنجاح. سيتم مراجعته من قبل إدارة الجمعية.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>الاسم الكامل *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>رقم الهوية *</label>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="مثال: 123456789"
                    value={formData.nationalId}
                    onChange={handleChange}
                    maxLength="9"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>رقم الهاتف *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="مثال: 0599000000"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>المدينة *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="مثال: نابلس"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>نوع المساعدة *</label>
                  <select
                    name="helpType"
                    value={formData.helpType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">اختر نوع المساعدة</option>
                    <option value="medical">مساعدة طبية</option>
                    <option value="education">مساعدة تعليمية</option>
                    <option value="food">مساعدة غذائية</option>
                    <option value="housing">مساعدة سكنية</option>
                    <option value="financial">مساعدة مالية</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>وصف الحالة *</label>
                <textarea
                  name="description"
                  placeholder="اشرح الحالة والظروف والاحتياج بشكل واضح..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>إرفاق مستند إثبات</label>

                <label className="custom-file-upload">
                  <input
                    type="file"
                    name="document"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                  />
                  <span>
                    {formData.document
                      ? formData.document.name
                      : "اختر ملفًا من جهازك"}
                  </span>
                </label>

                <small>يمكن رفع صورة أو ملف PDF.</small>
              </div>

              <button type="submit" className="submit-btn">
                إرسال الطلب
              </button>
            </form>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HelpRequest;