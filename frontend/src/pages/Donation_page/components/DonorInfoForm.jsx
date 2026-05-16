function DonorInfoForm({ donorInfo, onChange, errors = {} }) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">بيانات المتبرع</span>
      <div className="dp-form-grid">
        <div className="dp-field">
          <label className="dp-label">الاسم الكامل *</label>
          <input
            type="text"
            name="donorName"
            className={`dp-input ${errors.donorName ? "dp-input-error" : ""}`}
            value={donorInfo.donorName}
            onChange={onChange}
            placeholder="أدخل اسمك الكامل"
          />
          {errors.donorName && <p className="dp-error-msg">⚠ {errors.donorName}</p>}
        </div>

        <div className="dp-field">
          <label className="dp-label">البريد الإلكتروني *</label>
          <input
            type="email"
            name="donorEmail"
            className={`dp-input ${errors.donorEmail ? "dp-input-error" : ""}`}
            value={donorInfo.donorEmail}
            onChange={onChange}
            placeholder="example@email.com"
          />
          {errors.donorEmail && <p className="dp-error-msg">⚠ {errors.donorEmail}</p>}
        </div>

        <div className="dp-field">
          <label className="dp-label">رقم الهاتف</label>
          <input
            type="tel"
            name="donorPhone"
            className={`dp-input ${errors.donorPhone ? "dp-input-error" : ""}`}
            value={donorInfo.donorPhone}
            onChange={onChange}
            placeholder="05XXXXXXXX"
            maxLength="10"
          />
          {errors.donorPhone && <p className="dp-error-msg">⚠ {errors.donorPhone}</p>}
        </div>

        <div className="dp-field">
          <label className="dp-label">المدينة</label>
          <input
            type="text"
            name="donorCity"
            className="dp-input"
            value={donorInfo.donorCity}
            onChange={onChange}
            placeholder="مثال: نابلس"
          />
        </div>
      </div>

      <div className="dp-field dp-field-full">
        <label className="dp-label">ملاحظة (اختياري)</label>
        <textarea
          name="note"
          className="dp-textarea"
          value={donorInfo.note}
          onChange={onChange}
          placeholder="أضف ملاحظة أو رسالة للجمعية..."
          rows="3"
        />
      </div>
    </div>
  );
}

export default DonorInfoForm;
