// components/DonorInfoForm.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Personal information section of the donation form.
// Four fields: Full Name, Email, Phone, and City (optional).
// Renders in a 2-column grid that collapses to 1 column on mobile (via CSS).
// Each field highlights red when there's a validation error.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {string}   donorName      - full name value
 * @param {string}   donorEmail     - email value
 * @param {string}   donorPhone     - phone value
 * @param {string}   donorCity      - city value (optional)
 * @param {function} onNameChange   - setter callbacks
 * @param {function} onEmailChange
 * @param {function} onPhoneChange
 * @param {function} onCityChange
 * @param {object}   errors         - { donorName, donorEmail, donorPhone }
 */
function DonorInfoForm({
  donorName,
  donorEmail,
  donorPhone,
  donorCity,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onCityChange,
  errors,
}) {
  return (
    <div className="dp-section">
      <h3 className="dp-section-title">المعلومات الشخصية</h3>

      {/* Row 1: Name + Email */}
      <div className="dp-form-row">

        {/* Full name */}
        <div className="dp-field">
          <label className="dp-field-label">الاسم الكامل *</label>
          <input
            type="text"
            className={`dp-input ${errors.donorName ? "has-error" : ""}`}
            placeholder="مثال: محمد أحمد"
            value={donorName}
            onChange={(e) => onNameChange(e.target.value)}
          />
          {errors.donorName && (
            <p className="dp-error-msg">⚠ {errors.donorName}</p>
          )}
        </div>

        {/* Email */}
        <div className="dp-field">
          <label className="dp-field-label">البريد الإلكتروني *</label>
          <input
            type="email"
            className={`dp-input ${errors.donorEmail ? "has-error" : ""}`}
            placeholder="example@email.com"
            value={donorEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            dir="ltr" /* email addresses are LTR */
          />
          {errors.donorEmail && (
            <p className="dp-error-msg">⚠ {errors.donorEmail}</p>
          )}
        </div>
      </div>

      {/* Row 2: Phone + City */}
      <div className="dp-form-row">

        {/* Phone */}
        <div className="dp-field">
          <label className="dp-field-label">رقم الهاتف *</label>
          <input
            type="tel"
            className={`dp-input ${errors.donorPhone ? "has-error" : ""}`}
            placeholder="+966 50 123 4567"
            value={donorPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            dir="ltr" /* phone numbers are LTR */
          />
          {errors.donorPhone && (
            <p className="dp-error-msg">⚠ {errors.donorPhone}</p>
          )}
        </div>

        {/* City — optional, no error needed */}
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
