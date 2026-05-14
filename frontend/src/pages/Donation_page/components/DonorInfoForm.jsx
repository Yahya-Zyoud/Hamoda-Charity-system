// components/DonorInfoForm.jsx
// Personal info section: Full Name, Email, Phone, City.
// 2-column grid that collapses to 1 column on mobile (handled by responsive.css).
// Fields turn red when validation errors are passed from Home.jsx.

function DonorInfoForm({
  donorName, donorEmail, donorPhone, donorCity,
  onNameChange, onEmailChange, onPhoneChange, onCityChange,
  errors,
}) {
  return (
    <div className="dp-section">
      <h3 className="dp-section-title">المعلومات الشخصية</h3>

      {/* Row 1: Name + Email */}
      <div className="dp-form-row">
        <div className="dp-field">
          <label className="dp-field-label">الاسم الكامل *</label>
          <input
            type="text"
            className={`dp-input ${errors.donorName ? "has-error" : ""}`}
            placeholder="مثال: محمد أحمد"
            value={donorName}
            onChange={(e) => onNameChange(e.target.value)}
          />
          {errors.donorName && <p className="dp-error-msg">⚠ {errors.donorName}</p>}
        </div>

        <div className="dp-field">
          <label className="dp-field-label">البريد الإلكتروني *</label>
          <input
            type="email"
            className={`dp-input ${errors.donorEmail ? "has-error" : ""}`}
            placeholder="example@email.com"
            value={donorEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            dir="ltr"
          />
          {errors.donorEmail && <p className="dp-error-msg">⚠ {errors.donorEmail}</p>}
        </div>
      </div>

      {/* Row 2: Phone + City */}
      <div className="dp-form-row">
        <div className="dp-field">
          <label className="dp-field-label">رقم الهاتف *</label>
          <input
            type="tel"
            className={`dp-input ${errors.donorPhone ? "has-error" : ""}`}
            placeholder="+966 50 123 4567"
            value={donorPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            dir="ltr"
          />
          {errors.donorPhone && <p className="dp-error-msg">⚠ {errors.donorPhone}</p>}
        </div>

        <div className="dp-field">
          <label className="dp-field-label">المدينة (اختياري)</label>
          <input
            type="text"
            className="dp-input"
            placeholder="مثال: الرياض"
            value={donorCity}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default DonorInfoForm;
